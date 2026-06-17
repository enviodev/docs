#!/usr/bin/env node

/**
 * Generates static OG (Open Graph) social-card images for every showcase entry.
 *
 * One branded PNG per site is written to static/img/showcase/og/<slug>.png.
 * The showcase detail page (src/pages/showcase/_detail.js) references these via
 * <Head> og:image / twitter:image so each /showcase/<slug> URL unfurls with its
 * own card instead of falling back to the generic site banner.
 *
 * Why static cards and not the live screenshots: several showcase entries only
 * have a video (webm/mp4) or an animated gif, neither of which unfurls as a
 * static preview on most social platforms. A deterministic, generated card
 * guarantees a clean preview for every entry with no headless browser needed.
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

async function main() {
  const sites = loadSites();

  if (PREVIEW) {
    const previewOut = path.join(STATIC_DIR, "showcase-og-preview.png");
    const s = sites[0];
    const svg = buildSvg({ title: s.title, description: s.description });
    await sharp(Buffer.from(svg)).png().toFile(previewOut);
    console.log(`Preview written to: ${path.relative(REPO_ROOT, previewOut)} (source: ${s.slug})`);
    return;
  }

  console.log(`Generating showcase OG images (force=${FORCE}, dry-run=${DRY_RUN})…`);
  console.log(`Found ${sites.length} showcase entries.`);

  if (!DRY_RUN) fs.mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0,
    skipped = 0,
    errors = 0;

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

    const outPath = path.join(OUT_DIR, `${slug}.png`);
    const staticUrl = "/" + path.relative(STATIC_DIR, outPath);

    if (fs.existsSync(outPath) && !FORCE) {
      console.log(`  SKIP (exists): ${staticUrl}`);
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  WOULD generate: ${staticUrl}`);
      continue;
    }

    try {
      const svg = buildSvg({
        title: site.title,
        description: site.description,
      });
      await sharp(Buffer.from(svg)).png().toFile(outPath);
      console.log(`  OK: ${staticUrl}`);
      ok++;
    } catch (err) {
      console.error(`  ERROR: ${site.slug}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone. Generated: ${ok}, Skipped: ${skipped}, Errors: ${errors}`);
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
