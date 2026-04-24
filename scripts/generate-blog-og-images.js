#!/usr/bin/env node

/**
 * Generates OG (Open Graph) meta images for the blog index and tag pages.
 *
 * Outputs one PNG per tag in TAG_META (including the "all" view for /blog)
 * to static/blog-assets/og/*.png. These are referenced by BlogListPage and
 * BlogTagsPostsPage via <Head> og:image tags so that shared blog/tag URLs
 * unfurl with distinct, relevant preview cards.
 *
 * Individual blog posts are NOT handled here — they use their own
 * frontMatter.image, which authors supply per post.
 *
 * Usage:
 *   node scripts/generate-blog-og-images.js
 *   node scripts/generate-blog-og-images.js --dry-run
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DRY_RUN = process.argv.includes("--dry-run");

const REPO_ROOT = path.resolve(__dirname, "..");
const STATIC_DIR = path.join(REPO_ROOT, "static");
const OUT_DIR = path.join(STATIC_DIR, "blog-assets", "og");

const WIDTH = 1200;
const HEIGHT = 630;

const COLOR_BG = "#0F0F0F";
const COLOR_ACCENT = "#FF8267";
const COLOR_WHITE = "#FFFFFF";
const COLOR_GRAY = "#A0A0A0";

// Envio wordmark embedded as a base64 data URI. Matches the approach used by
// scripts/generate-og-images.js so both generators share the same logo source.
const logoPath = path.join(STATIC_DIR, "img", "envio-logo.png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");
const logoDataUri = `data:image/png;base64,${logoBase64}`;
const LOGO_W = 172;
const LOGO_H = 54;
const LOGO_X = 90;
const LOGO_Y = 60;

const SECTION_FONT_SIZE = 28;
const SECTION_X = 90;
const SECTION_Y = 280;

const TITLE_SIZE_STEPS = [
  [72, 86],
  [60, 72],
  [52, 64],
  [44, 54],
];

const TITLE_START_Y = 360;
const TITLE_DESC_GAP = 20;

const GLOW_LARGE_OPACITY = 0.18;
const GLOW_SMALL_OPACITY = 0.05;

const DESC_X = 85;
const DESC_FONT_SIZE = 30;
const DESC_LINE_HEIGHT = 40;

function escXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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

function titleLayout(title) {
  const avail = 1040;
  for (const [fontSize, lineHeight] of TITLE_SIZE_STEPS) {
    const avgCharPx = fontSize * 0.58;
    const charsPerLine = Math.floor(avail / avgCharPx);
    const lines = wrapText(title, charsPerLine).slice(0, 2);
    if (lines.length === 2 && wrapText(title, charsPerLine).length > 2) {
      lines[1] =
        lines[1].length >= charsPerLine - 1
          ? lines[1].slice(0, charsPerLine - 1) + "…"
          : lines[1];
    }
    return { lines, fontSize, lineHeight };
  }
  return { lines: [title.slice(0, 24) + "…"], fontSize: 44, lineHeight: 54 };
}

function buildSvg({ section, title, description }) {
  const { lines: titleLines, fontSize: TITLE_FONT_SIZE, lineHeight: TITLE_LINE_HEIGHT } =
    titleLayout(title);

  const DESC_CHARS = Math.floor(1040 / (DESC_FONT_SIZE * 0.52));
  const descLines = description ? wrapText(description, DESC_CHARS).slice(0, 3) : [];
  if (descLines.length === 3 && description && wrapText(description, DESC_CHARS).length > 3) {
    descLines[2] =
      descLines[2].length >= DESC_CHARS - 1
        ? descLines[2].slice(0, DESC_CHARS - 1) + "…"
        : descLines[2];
  }

  const DESC_START_Y = TITLE_START_Y + titleLines.length * TITLE_LINE_HEIGHT + TITLE_DESC_GAP;

  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<text x="90" y="${TITLE_START_Y + i * TITLE_LINE_HEIGHT}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${TITLE_FONT_SIZE}" font-weight="bold" fill="${COLOR_WHITE}">${escXml(line)}</text>`
    )
    .join("\n    ");

  const descSvg = descLines
    .map(
      (line, i) =>
        `<text x="${DESC_X}" y="${DESC_START_Y + i * DESC_LINE_HEIGHT}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${DESC_FONT_SIZE}" fill="${COLOR_GRAY}">${escXml(line)}</text>`
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

  <text x="${SECTION_X}" y="${SECTION_Y}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${SECTION_FONT_SIZE}" fill="${COLOR_ACCENT}">${escXml(section)}</text>

  ${titleSvg}

  ${descSvg}
</svg>`;
}

// Keep in sync with TAG_META in src/theme/BlogListPage/index.js
const TAG_META = {
  all: {
    slug: "blog",
    section: "Blog",
    title: "Envio Blog",
    description:
      "Technical articles, case studies, tutorials, product updates, and agentic indexing insights from Envio's blockchain data infrastructure team.",
  },
  "case-studies": {
    slug: "case-studies",
    section: "Blog",
    title: "Envio Case Studies",
    description:
      "See how industry-leading Web3 teams scale onchain data with Envio in minutes. Learn how to do the same or build production-ready indexers for your project.",
  },
  "product-updates": {
    slug: "product-updates",
    section: "Blog",
    title: "Envio Product Updates",
    description:
      "Monthly product updates and change logs across Envio. New releases, features, supported networks, agentic indexing workflows and more.",
  },
  announcements: {
    slug: "announcements",
    section: "Blog",
    title: "Envio Announcements",
    description:
      "Official Envio updates: product launches, partnerships, new network support, and integrations across HyperIndex, HyperSync, and HyperRPC.",
  },
  ai: {
    slug: "ai",
    section: "Blog",
    title: "Envio AI",
    description:
      "Build agentic blockchain indexing, MCP servers, and AI-native data workflows using Envio. Real-time onchain data for LLMs and AI agents.",
  },
  tutorials: {
    slug: "tutorials",
    section: "Blog",
    title: "Envio Tutorials",
    description:
      "Hands-on developer tutorials covering subgraph migrations, querying onchain data at scale, building production-ready indexers and much more using Envio.",
  },
};

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Generating blog OG images (dry-run=${DRY_RUN})…`);

  let ok = 0;
  for (const key of Object.keys(TAG_META)) {
    const meta = TAG_META[key];
    const outPath = path.join(OUT_DIR, `${meta.slug}.png`);
    const staticUrl = "/" + path.relative(STATIC_DIR, outPath);

    if (DRY_RUN) {
      console.log(`  WOULD generate: ${staticUrl}`);
      continue;
    }

    const svg = buildSvg({
      section: meta.section,
      title: meta.title,
      description: meta.description,
    });
    await sharp(Buffer.from(svg)).png().toFile(outPath);
    console.log(`  OK: ${staticUrl}`);
    ok++;
  }

  console.log(`\nDone. Generated: ${ok}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
