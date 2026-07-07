/**
 * generate-shipper-videos.js
 *
 * Parses the Shipper's Logs page (src/pages/videos.mdx) and writes a small
 * feed at static/shipper-videos.json, published as
 * https://docs.envio.dev/shipper-videos.json.
 *
 * The envio.dev landing changelog (enviodev/ui) fetches this feed at build
 * time to embed the matching release video, so adding a delayed Shipper's Log
 * here automatically surfaces it on the changelog with no cross-repo edits.
 *
 * Output shape: { "v3.0.0": { "id": "<youtubeId>", "title": "..." }, ... }
 *
 * Runs on prestart / prebuild (see package.json).
 */

const fs = require("fs");
const path = require("path");

const VIDEOS_FILE = path.join(__dirname, "../src/pages/videos.mdx");
const OUTPUT_FILE = path.join(__dirname, "../static/shipper-videos.json");

function parse(src) {
  const map = {};
  let pendingTag = null;
  for (const line of src.split("\n")) {
    // Version anywhere in an h2 heading (e.g. "## v3.0.0 ..." or "## HyperIndex v3.0.0").
    const heading = line.match(/^##\s+.*?(v\d+\.\d+\.\d+)/);
    if (heading) {
      pendingTag = heading[1];
      continue;
    }
    const video = line.match(/<Video\s+id="([^"]+)"(?:\s+title="([^"]*)")?/);
    if (video && pendingTag) {
      map[pendingTag] = { id: video[1], title: video[2] || pendingTag };
      pendingTag = null;
    }
  }
  return map;
}

function main() {
  let map = {};
  try {
    map = parse(fs.readFileSync(VIDEOS_FILE, "utf8"));
  } catch (err) {
    console.warn(`[generate-shipper-videos] Could not read videos.mdx (${err.message}).`);
  }
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(map));
  console.log(
    `[generate-shipper-videos] Wrote ${Object.keys(map).length} videos to static/shipper-videos.json`
  );
}

main();
