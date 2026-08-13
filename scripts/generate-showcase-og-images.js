#!/usr/bin/env node

/**
 * Generates static OG (Open Graph) social-card images for every showcase entry.
 *
 * One branded PNG per site is written to static/img/showcase/og/<slug>.png.
 * The showcase detail page (src/pages/showcase/_detail.js) references these via
 * <Head> og:image / twitter:image so each /showcase/<slug> URL unfurls with its
 * own card instead of falling back to the generic site banner.
 *
 * The showcase index itself gets the same treatment, written to _index.png and
 * referenced by src/pages/showcase/index.js. Entry slugs are restricted to
 * [a-z0-9-] below, so the leading underscore cannot collide with a real entry.
 *
 * Each card is that entry's own showcase asset cropped to the 1200x630 OG frame,
 * with no branding over it, so a shared /showcase/<slug> link unfurls as the
 * project itself rather than as generic Envio branding.
 *
 * Animated gifs are flattened to their first frame, since no social platform
 * unfurls an animation. Video entries (webm/mp4) cannot be sampled at build time
 * without ffmpeg, so each carries a committed `poster` still in _data.js that is
 * used here instead. Any entry left with no usable still falls back to a
 * generated text card and is named in the run summary.
 *
 * The source of truth for the entries is src/pages/showcase/_data.js. That file
 * is an ES module that webpack bundles for the site; here we evaluate it in a
 * small sandbox so this CommonJS build script and the live pages never drift.
 *
 * Usage:
 *   node scripts/generate-showcase-og-images.js            # generate all
 *   node scripts/generate-showcase-og-images.js --force    # overwrite existing
 *   node scripts/generate-showcase-og-images.js --dry-run  # print, write nothing
 *   node scripts/generate-showcase-og-images.js --preview  # one sample → static/showcase-og-preview.png
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const FORCE = process.argv.includes("--force");
const DRY_RUN = process.argv.includes("--dry-run");
const PREVIEW = process.argv.includes("--preview");

const REPO_ROOT = path.resolve(__dirname, "..");
const STATIC_DIR = path.join(REPO_ROOT, "static");
const OUT_DIR = path.join(STATIC_DIR, "img", "showcase", "og");
const DATA_FILE = path.join(REPO_ROOT, "src", "pages", "showcase", "_data.js");
const INDEX_FILE = path.join(REPO_ROOT, "src", "pages", "showcase", "index.js");
const INDEX_CARD_NAME = "_index";
const NETWORK_COUNT_FILE = path.join(REPO_ROOT, "src", "data", "network-count.json");

// Image dimensions (standard OG image)
const WIDTH = 1200;
const HEIGHT = 630;

// Brand colors — kept in sync with the docs/blog OG generators
const COLOR_BG = "#0F0F0F";
const COLOR_ACCENT = "#FF8267";
const COLOR_WHITE = "#FFFFFF";
const COLOR_GRAY = "#A0A0A0";

// Envio logo as base64
const logoPath = path.join(STATIC_DIR, "img", "envio-logo.png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");
const logoDataUri = `data:image/png;base64,${logoBase64}`;
const LOGO_W = 224;
const LOGO_H = 54;
const LOGO_X = 90;
const LOGO_Y = 60;

const CONTENT_X = 90;

const SECTION_FONT_SIZE = 26;

const TITLE_SIZE_STEPS = [
  [72, 86],
  [60, 72],
  [52, 64],
  [44, 54],
];

const DESC_FONT_SIZE = 30;
const DESC_LINE_HEIGHT = 42;
const DESC_MAX_LINES = 3;

// Top-anchored layout, matching the docs/blog OG cards: small section label,
// then the title, then the description. Multi-line titles are capped at 52px
// (see titleLayout) so even a two-line title plus a three-line description
// stays within the 630px canvas.
const SECTION_Y = 278;
const TITLE_START_Y = 356;

// Showcase assets live under this prefix; anything else is rejected rather than
// read, so a bad _data.js entry cannot pull an arbitrary file into a card.
const ASSET_PREFIX = "/img/showcase/";
const STATIC_ASSET_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const TITLE_DESC_GAP = 2; // extra gap below the title block, before the description

const GLOW_LARGE_OPACITY = 0.18;
const GLOW_SMALL_OPACITY = 0.05;

function escXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + (current ? " " : "") + word).length <= maxChars) {
      current = current ? `${current} ${word}` : word;
    } else {
      if (current) lines.push(current);
      current = word.length > maxChars ? word.slice(0, maxChars - 1) + "…" : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function titleLayout(title) {
  const avail = 1020;
  // Short titles render large on a single line. Anything that needs two lines is
  // capped at <= 52px so the centred section + title + description group always
  // fits the 630px canvas.
  for (const [fontSize, lineHeight] of TITLE_SIZE_STEPS) {
    const charsPerLine = Math.floor(avail / (fontSize * 0.58));
    const all = wrapText(title, charsPerLine);
    if (all.length === 1) return { lines: all, fontSize, lineHeight };
    if (fontSize <= 52) {
      const lines = all.slice(0, 2);
      if (all.length > 2) {
        lines[1] =
          lines[1].length >= charsPerLine - 1
            ? lines[1].slice(0, charsPerLine - 1) + "…"
            : lines[1] + "…";
      }
      return { lines, fontSize, lineHeight };
    }
  }
  return { lines: [title.slice(0, 24) + "…"], fontSize: 44, lineHeight: 54 };
}

function buildSvg({ title, description }) {
  const { lines: titleLines, fontSize: TITLE_FONT_SIZE, lineHeight: TITLE_LINE_HEIGHT } =
    titleLayout(title);

  const DESC_CHARS = Math.floor(1020 / (DESC_FONT_SIZE * 0.52));
  const descLines = description ? wrapText(description, DESC_CHARS).slice(0, DESC_MAX_LINES) : [];
  const last = descLines.length - 1;
  if (descLines.length === DESC_MAX_LINES && description && wrapText(description, DESC_CHARS).length > DESC_MAX_LINES) {
    descLines[last] =
      descLines[last].length >= DESC_CHARS - 1
        ? descLines[last].slice(0, DESC_CHARS - 1) + "…"
        : descLines[last] + "…";
  }

  const descStartY =
    TITLE_START_Y + titleLines.length * TITLE_LINE_HEIGHT + TITLE_DESC_GAP;

  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<text x="${CONTENT_X}" y="${TITLE_START_Y + i * TITLE_LINE_HEIGHT}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${TITLE_FONT_SIZE}" font-weight="bold" fill="${COLOR_WHITE}">${escXml(line)}</text>`
    )
    .join("\n    ");

  const descSvg = descLines
    .map(
      (line, i) =>
        `<text x="${CONTENT_X}" y="${descStartY + i * DESC_LINE_HEIGHT}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${DESC_FONT_SIZE}" fill="${COLOR_GRAY}">${escXml(line)}</text>`
    )
    .join("\n    ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <radialGradient id="bgGlow" cx="85%" cy="15%" r="65%" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${COLOR_ACCENT}" stop-opacity="${GLOW_LARGE_OPACITY}"/>
      <stop offset="100%" stop-color="${COLOR_BG}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bgGlow2" cx="15%" cy="85%" r="50%" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${COLOR_ACCENT}" stop-opacity="${GLOW_SMALL_OPACITY}"/>
      <stop offset="100%" stop-color="${COLOR_BG}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLOR_BG}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGlow2)"/>

  <image xlink:href="${logoDataUri}" x="${LOGO_X}" y="${LOGO_Y}" width="${LOGO_W}" height="${LOGO_H}"/>

  <text x="${CONTENT_X}" y="${SECTION_Y}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${SECTION_FONT_SIZE}" fill="${COLOR_ACCENT}">Showcase</text>

  ${titleSvg}

  ${descSvg}
</svg>`;
}

/**
 * Absolute path to the entry's own screenshot, or null when it has no asset that
 * can be rendered as a still. Entries whose showcase asset is a video carry a
 * `poster` still alongside it purely for this card, since the page itself plays
 * the video and never renders the poster.
 */
function resolveAsset(site) {
  const ref = site.poster || site.image;
  if (typeof ref !== "string" || !ref.startsWith(ASSET_PREFIX) || ref.includes("..")) {
    return null;
  }
  if (!STATIC_ASSET_EXTS.has(path.extname(ref).toLowerCase())) return null;

  const abs = path.join(STATIC_DIR, ref);
  return fs.existsSync(abs) ? abs : null;
}

/**
 * The entry's screenshot cropped to the OG frame, with no branding over it so
 * the project's own interface is all that shows. Every showcase asset is
 * landscape and close to 16:9, so a top-anchored cover crop into the slightly
 * wider 1200x630 frame trims the edges without cutting into the content.
 * `animated: false` takes frame one of a gif rather than the whole sequence.
 */
function buildAssetCard(assetPath) {
  return sharp(assetPath, { animated: false })
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "top" })
    .png()
    .toBuffer();
}

function buildTextCard({ title, description }) {
  return sharp(Buffer.from(buildSvg({ title, description }))).png().toBuffer();
}

/**
 * Load the showcase entries from src/pages/showcase/_data.js without duplicating
 * them here. The file is an ESM module with a single JSON import and a single
 * named export; we strip the import (supplying `networkCount` ourselves) and
 * turn the export into a return, then run it in a Function sandbox.
 */
function loadSites() {
  let src = fs.readFileSync(DATA_FILE, "utf8");
  src = src.replace(/^\s*import\s+networkCount\s+from\s+["'][^"']+["'];?\s*$/m, "");
  src = src.replace(/^\s*export\s*\{[^}]*\};?\s*$/m, "return { tags, sites };");
  const networkCount = JSON.parse(fs.readFileSync(NETWORK_COUNT_FILE, "utf8"));
  // eslint-disable-next-line no-new-func
  const factory = new Function("networkCount", src);
  const { sites } = factory(networkCount);
  if (!Array.isArray(sites) || sites.length === 0) {
    throw new Error("Could not load showcase sites from _data.js");
  }
  return sites;
}

/**
 * Read the showcase index page's own title and description straight out of
 * index.js, so its card and its <Head> tags can never drift apart.
 */
function loadIndexMeta() {
  const src = fs.readFileSync(INDEX_FILE, "utf8");
  // Tolerant of the line breaks and quote style a formatter may introduce, so a
  // reformat of index.js cannot fail the build.
  const read = (name) => {
    const m = src.match(
      new RegExp(`\\bconst\\s+${name}\\s*=\\s*(["'])((?:\\\\.|(?!\\1).)*)\\1`)
    );
    return m ? m[2] : null;
  };
  const title = read("TITLE");
  const description = read("DESCRIPTION");
  if (!title || !description) {
    throw new Error(
      "Could not read TITLE/DESCRIPTION from src/pages/showcase/index.js"
    );
  }
  return { title, description };
}

/**
 * Shared write path for every card. Returns "ok", "skipped" or "dry" so the run
 * summary reflects what actually happened.
 */
async function writeCard(name, makeBuffer) {
  const outPath = path.join(OUT_DIR, `${name}.png`);
  const staticUrl = "/" + path.relative(STATIC_DIR, outPath);

  if (fs.existsSync(outPath) && !FORCE) {
    console.log(`  SKIP (exists): ${staticUrl}`);
    return "skipped";
  }
  if (DRY_RUN) {
    console.log(`  WOULD generate: ${staticUrl}`);
    return "dry";
  }

  fs.writeFileSync(outPath, await makeBuffer());
  console.log(`  OK: ${staticUrl}`);
  return "ok";
}

async function main() {
  const sites = loadSites();
  const indexMeta = loadIndexMeta();

  if (PREVIEW) {
    const previewOut = path.join(STATIC_DIR, "showcase-og-preview.png");
    // Preview whatever that entry would really ship, so the overlay constants
    // can be tuned against the layout most cards actually use.
    const s = sites[0];
    const asset = resolveAsset(s);
    const buf = asset
      ? await buildAssetCard(asset)
      : await buildTextCard({ title: s.title, description: s.description });
    fs.writeFileSync(previewOut, buf);
    console.log(
      `Preview written to: ${path.relative(REPO_ROOT, previewOut)} ` +
        `(source: ${s.slug}, ${asset ? "asset card" : "text card"})`
    );
    return;
  }

  console.log(`Generating showcase OG images (force=${FORCE}, dry-run=${DRY_RUN})…`);
  console.log(`Found ${sites.length} showcase entries.`);

  if (!DRY_RUN) fs.mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0,
    skipped = 0,
    errors = 0;
  const noAsset = [];

  const tally = (status) => {
    if (status === "ok") ok++;
    else if (status === "skipped") skipped++;
  };

  try {
    tally(await writeCard(INDEX_CARD_NAME, () => buildTextCard(indexMeta)));
  } catch (err) {
    console.error(`  ERROR: ${INDEX_CARD_NAME}: ${err.message}`);
    errors++;
  }

  for (const site of sites) {
    // The slug becomes both the output filename and the og:image URL used by
    // _detail.js, so it must be a plain lowercase-hyphen token — reject anything
    // else rather than write outside OUT_DIR or break the slug→card contract.
    const slug = String(site.slug || "");
    if (!/^[a-z0-9-]+$/.test(slug)) {
      console.error(`  ERROR: invalid slug "${site.slug}" — skipping`);
      errors++;
      continue;
    }

    const asset = resolveAsset(site);
    if (!asset) noAsset.push(slug);

    try {
      tally(
        await writeCard(slug, () =>
          asset
            ? buildAssetCard(asset)
            : buildTextCard({ title: site.title, description: site.description })
        )
      );
    } catch (err) {
      console.error(`  ERROR: ${site.slug}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone. Generated: ${ok}, Skipped: ${skipped}, Errors: ${errors}`);
  if (noAsset.length > 0) {
    console.log(
      `\n${noAsset.length} entr${noAsset.length === 1 ? "y has" : "ies have"} no still asset ` +
        `and fell back to a text card: ${noAsset.join(", ")}.\n` +
        `Add a static image to _data.js for these to unfurl as the project itself.`
    );
  }
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
