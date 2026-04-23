#!/usr/bin/env node

/**
 * Generates OG (Open Graph) meta images for all docs pages.
 *
 * Usage:
 *   node scripts/generate-og-images.js            # generate for all docs
 *   node scripts/generate-og-images.js --force    # overwrite existing images
 *   node scripts/generate-og-images.js --dry-run  # print what would be done
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const FORCE = process.argv.includes("--force");
const DRY_RUN = process.argv.includes("--dry-run");
// --preview [path/to/doc.md]  — render one image to static/og-preview.png, no file edits
const PREVIEW_IDX = process.argv.indexOf("--preview");
const PREVIEW = PREVIEW_IDX !== -1;
const PREVIEW_FILE = PREVIEW && process.argv[PREVIEW_IDX + 1] && !process.argv[PREVIEW_IDX + 1].startsWith("--")
  ? path.resolve(process.argv[PREVIEW_IDX + 1])
  : null;

const REPO_ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(REPO_ROOT, "docs");
const STATIC_DIR = path.join(REPO_ROOT, "static");
const OG_DIR = path.join(STATIC_DIR, "docs-assets", "og");

// Image dimensions (standard OG image)
const WIDTH = 1200;
const HEIGHT = 630;

// Brand colors
const COLOR_BG = "#0F0F0F";
const COLOR_ACCENT = "#FF8267";
const COLOR_WHITE = "#FFFFFF";
const COLOR_GRAY = "#A0A0A0";

// Envio logo as base64
const logoPath = path.join(STATIC_DIR, "img", "envio-logo.png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");
const logoDataUri = `data:image/png;base64,${logoBase64}`;

// Logo rendered at native height 54 (390x94 → ~224x54)
const LOGO_W = 224;
const LOGO_H = 54;
const LOGO_X = 90;
const LOGO_Y = 60;

// ─── LAYOUT CONFIG ────────────────────────────────────────────────────────────
// Edit these values to adjust the visual design, then run `yarn preview-og`.

const SECTION_FONT_SIZE = 28;   // font size of the small section label (e.g. "HyperIndex")
const SECTION_X = 90;           // horizontal position (px from left) of the section label
const SECTION_Y = 280;          // vertical position (px from top) of the section label

// Title font sizes tried largest-first; the first one that fits within the image
// width is used. Each entry is [fontSize, lineHeight].
const TITLE_SIZE_STEPS = [
  [72, 86],   // short titles  (≤ ~24 chars)
  [60, 72],   // medium titles (≤ ~29 chars)
  [52, 64],   // longer titles (≤ ~34 chars)
  [44, 54],   // very long     (≤ ~40 chars)
];

const TITLE_START_Y = 360;      // vertical position of the first title line

// Gap (px) between the last title line and the first description line
const TITLE_DESC_GAP = 0;

// Gradient opacities (0 = invisible, 1 = full color)
const GLOW_LARGE_OPACITY = 0.18; // top-right glow — main accent burst
const GLOW_SMALL_OPACITY = 0.05; // bottom-left glow — subtle secondary

const DESC_X = 85;              // horizontal position (px from left) of the description text
const DESC_FONT_SIZE = 30;      // font size of the description text
const DESC_LINE_HEIGHT = 40;    // vertical spacing between description lines

// ─── END LAYOUT CONFIG ────────────────────────────────────────────────────────

/** Escape XML special characters for SVG text */
function escXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Split a string into plain/code segments on backtick boundaries.
 * "`config.yaml` file" → [{type:"code", content:"config.yaml"}, {type:"text", content:" file"}]
 */
function parseSegments(text) {
  const segments = [];
  const parts = text.split("`");
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "") continue;
    segments.push({ type: i % 2 === 0 ? "text" : "code", content: parts[i] });
  }
  return segments;
}

/**
 * Render one line of text as SVG, turning `backtick` spans into code boxes.
 *
 * @param {number} startX   - left edge of the line
 * @param {number} y        - baseline y of the line
 * @param {string} text     - raw text, may contain `backtick` spans
 * @param {number} fontSize - font size in px
 * @param {string} color    - default text color (hex)
 * @param {boolean} bold    - whether the default text is bold
 */
function renderLine(startX, y, text, fontSize, color, bold = false) {
  const segments = parseSegments(text);
  const svgParts = [];

  // Approximate char widths (px per character at given fontSize)
  const plainCharW = fontSize * (bold ? 0.58 : 0.52);   // DejaVu Sans (bold is wider)
  const codeCharW  = fontSize * 0.60;                    // DejaVu Sans Mono

  // Code box vertical metrics
  const boxPadX  = fontSize * 0.20;   // horizontal padding inside the box
  const boxPadY  = fontSize * 0.12;   // vertical padding inside the box
  const boxH     = fontSize + boxPadY * 2;
  const boxY     = y - fontSize * 0.82 - boxPadY;  // top of the box rectangle
  const boxColor = "#2a2a2a";                       // code box background fill
  const codeColor = "#e8e8e8";                      // code text color

  let curX = startX;

  for (const seg of segments) {
    if (seg.type === "text") {
      const w = seg.content.length * plainCharW;
      const weight = bold ? ' font-weight="bold"' : "";
      svgParts.push(
        `<text x="${Math.round(curX)}" y="${y}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${fontSize}"${weight} fill="${color}">${escXml(seg.content)}</text>`
      );
      curX += w;
    } else {
      const innerW = seg.content.length * codeCharW;
      const boxW   = innerW + boxPadX * 2;
      // Background rect
      svgParts.push(
        `<rect x="${Math.round(curX)}" y="${Math.round(boxY)}" width="${Math.round(boxW)}" height="${Math.round(boxH)}" rx="4" fill="${boxColor}"/>`
      );
      // Monospace text
      svgParts.push(
        `<text x="${Math.round(curX + boxPadX)}" y="${y}" font-family="DejaVu Sans Mono, Courier New, monospace" font-size="${fontSize}" fill="${codeColor}">${escXml(seg.content)}</text>`
      );
      curX += boxW + fontSize * 0.20; // gap after code box
    }
  }

  return svgParts.join("\n    ");
}

/**
 * Wrap text into lines no longer than maxChars.
 * Returns an array of line strings.
 */
function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
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

/**
 * Pick title font size and chars-per-line based on title length.
 * Approximate: DejaVu Sans Bold avg char width ≈ fontSize * 0.58.
 * Available width = 1200 - 80 (left) - 80 (right) = 1040px.
 */
function titleLayout(title) {
  const avail = 1040; // px
  for (const [fontSize, lineHeight] of TITLE_SIZE_STEPS) {
    const avgCharPx = fontSize * 0.58;
    const charsPerLine = Math.floor(avail / avgCharPx);
    const lines = wrapText(title, charsPerLine).slice(0, 2);
    // Truncate second line with ellipsis if more would follow
    if (lines.length === 2 && wrapText(title, charsPerLine).length > 2) {
      const maxChars = charsPerLine;
      lines[1] =
        lines[1].length >= maxChars - 1
          ? lines[1].slice(0, maxChars - 1) + "…"
          : lines[1];
    }
    return { lines, fontSize, lineHeight };
  }
  // Fallback
  return { lines: [title.slice(0, 24) + "…"], fontSize: 44, lineHeight: 54 };
}

/**
 * Build an SVG string for an OG image.
 */
function buildSvg({ section, title, description }) {
  const { lines: titleLines, fontSize: TITLE_FONT_SIZE, lineHeight: TITLE_LINE_HEIGHT } =
    titleLayout(title);

  // Description: max 2 lines. Chars per line derived from DESC_FONT_SIZE so it
  // stays within the image width (avgCharPx ≈ fontSize * 0.52).
  const DESC_CHARS = Math.floor(1040 / (DESC_FONT_SIZE * 0.52));
  const descLines = description ? wrapText(description, DESC_CHARS).slice(0, 2) : [];
  if (descLines.length === 2 && description && wrapText(description, DESC_CHARS).length > 2) {
    descLines[1] =
      descLines[1].length >= DESC_CHARS - 1
        ? descLines[1].slice(0, DESC_CHARS - 1) + "…"
        : descLines[1];
  }

  const DESC_START_Y = TITLE_START_Y + titleLines.length * TITLE_LINE_HEIGHT + TITLE_DESC_GAP;

  const titleSvg = titleLines
    .map((line, i) =>
      renderLine(90, TITLE_START_Y + i * TITLE_LINE_HEIGHT, line, TITLE_FONT_SIZE, COLOR_WHITE, true)
    )
    .join("\n    ");

  const descSvg = descLines
    .map((line, i) =>
      renderLine(DESC_X, DESC_START_Y + i * DESC_LINE_HEIGHT, line, DESC_FONT_SIZE, COLOR_GRAY)
    )
    .join("\n    ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Large accent glow — top-right corner -->
    <radialGradient id="bgGlow" cx="85%" cy="15%" r="65%" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${COLOR_ACCENT}" stop-opacity="${GLOW_LARGE_OPACITY}"/>
      <stop offset="100%" stop-color="${COLOR_BG}" stop-opacity="0"/>
    </radialGradient>
    <!-- Small accent glow — bottom-left corner -->
    <radialGradient id="bgGlow2" cx="15%" cy="85%" r="50%" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${COLOR_ACCENT}" stop-opacity="${GLOW_SMALL_OPACITY}"/>
      <stop offset="100%" stop-color="${COLOR_BG}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLOR_BG}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGlow2)"/>

  <!-- Envio logo -->
  <image xlink:href="${logoDataUri}" x="${LOGO_X}" y="${LOGO_Y}" width="${LOGO_W}" height="${LOGO_H}"/>

  <!-- Section label -->
  <text x="${SECTION_X}" y="${SECTION_Y}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${SECTION_FONT_SIZE}" fill="${COLOR_ACCENT}">${escXml(section)}</text>

  <!-- Title -->
  ${titleSvg}

  <!-- Description -->
  ${descSvg}
</svg>`;
}

/** Parse YAML-ish frontmatter from markdown content. Returns object or null. */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)/);
    if (!kv) continue;
    fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return fm;
}

/** Return the byte range of the frontmatter block (including ---). */
function frontmatterRange(content) {
  const match = content.match(/^(---\r?\n[\s\S]*?\r?\n---)/);
  if (!match) return null;
  return { block: match[1], end: match[1].length };
}

/** Add or update the `image` field inside an existing frontmatter block. */
function setFrontmatterImage(content, imagePath) {
  const range = frontmatterRange(content);
  if (!range) return content;

  const { block, end } = range;
  const rest = content.slice(end);

  // If `image:` already exists in frontmatter, replace it
  if (/^image:/m.test(block)) {
    const updated = block.replace(/^image:.*$/m, `image: ${imagePath}`);
    return updated + rest;
  }

  // Otherwise insert before closing ---
  const updatedBlock = block.replace(/(\r?\n---$)/, `\nimage: ${imagePath}$1`);
  return updatedBlock + rest;
}

/** Determine section label from file path relative to docs/ */
function getSection(filePath) {
  const rel = path.relative(DOCS_DIR, filePath);
  const parts = rel.split(path.sep);
  // parts[0] = HyperIndex | HyperSync | HyperRPC
  // parts[1] = Advanced | Guides | ... (optional)
  return parts[0] || "Envio";
}

/** Convert a file path to an output PNG path under static/docs-assets/og/ */
function getOutputPath(filePath) {
  const rel = path.relative(DOCS_DIR, filePath);
  const withoutExt = rel.replace(/\.(md|mdx)$/, "");
  return path.join(OG_DIR, `${withoutExt}.png`);
}

/** Convert output path to static-relative URL for frontmatter */
function toStaticUrl(outputPath) {
  return "/" + path.relative(STATIC_DIR, outputPath);
}

/** Recursively collect all .md and .mdx files, skipping LLM variants */
function collectDocs(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip LLM variant directories
      if (entry.name.endsWith("-LLM") || entry.name === "unused") continue;
      results.push(...collectDocs(full));
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const fm = parseFrontmatter(content);

  if (!fm) {
    console.warn(`  SKIP (no frontmatter): ${path.relative(REPO_ROOT, filePath)}`);
    return { status: "skip" };
  }

  const title = fm.title || fm.sidebar_label || fm.id || path.basename(filePath, path.extname(filePath));
  const description = fm.description || "";
  const section = getSection(filePath);
  const outputPath = getOutputPath(filePath);
  const staticUrl = toStaticUrl(outputPath);

  // Skip if image already set and not forcing
  if (fm.image && !FORCE) {
    console.log(`  SKIP (has image): ${path.relative(REPO_ROOT, filePath)}`);
    return { status: "skip" };
  }

  if (DRY_RUN) {
    console.log(`  WOULD generate: ${staticUrl}`);
    return { status: "dry-run" };
  }

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Build SVG and convert to PNG
  const svg = buildSvg({ section, title, description });
  await sharp(Buffer.from(svg)).png().toFile(outputPath);

  // Update frontmatter in source file
  const updated = setFrontmatterImage(content, staticUrl);
  fs.writeFileSync(filePath, updated, "utf8");

  console.log(`  OK: ${path.relative(REPO_ROOT, filePath)} → ${staticUrl}`);
  return { status: "ok" };
}

async function runPreview() {
  const PREVIEW_OUT = path.join(STATIC_DIR, "og-preview.png");

  let section, title, description;

  if (PREVIEW_FILE) {
    const content = fs.readFileSync(PREVIEW_FILE, "utf8");
    const fm = parseFrontmatter(content);
    if (!fm) {
      console.error("No frontmatter found in the specified file.");
      process.exit(1);
    }
    section = getSection(PREVIEW_FILE);
    title = fm.title || fm.sidebar_label || fm.id || path.basename(PREVIEW_FILE, path.extname(PREVIEW_FILE));
    description = fm.description || "";
    console.log(`Preview source: ${path.relative(REPO_ROOT, PREVIEW_FILE)}`);
  } else {
    // Default sample data so you can tweak the design without needing a real file
    section = "HyperIndex";
    title = "Getting Started with Envio";
    description = "Get started with Envio indexer setup, templates, and local or hosted deployment quickly.";
    console.log("Preview source: sample data (pass a file path to use real content)");
  }

  const svg = buildSvg({ section, title, description });
  await sharp(Buffer.from(svg)).png().toFile(PREVIEW_OUT);
  console.log(`Preview written to: ${path.relative(REPO_ROOT, PREVIEW_OUT)}`);
}

async function main() {
  if (PREVIEW) {
    await runPreview();
    return;
  }

  console.log(`Generating OG images for docs (force=${FORCE}, dry-run=${DRY_RUN})…`);

  const files = collectDocs(DOCS_DIR);
  console.log(`Found ${files.length} docs files.`);

  let ok = 0, skipped = 0, errors = 0;

  for (const file of files) {
    try {
      const result = await processFile(file);
      if (result.status === "ok") ok++;
      else skipped++;
    } catch (err) {
      console.error(`  ERROR: ${path.relative(REPO_ROOT, file)}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone. Generated: ${ok}, Skipped: ${skipped}, Errors: ${errors}`);
  if (errors > 0) process.exit(1);
}

main();
