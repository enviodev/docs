import { createVercelHandler } from "docusaurus-plugin-mcp-server/adapters";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// Docusaurus appends anchor spans to headings that corrupt search results and TOC:
//   ## My Heading​[](/docs/foo#my-heading "Direct link to My Heading")
const HEADING_ANCHOR_RE =
  /[ ​]*\[\]\([^)]*?"Direct link to [^"]*?"\)/g;

function clean(text) {
  return text.replace(HEADING_ANCHOR_RE, "").replaceAll("​", "");
}

const docs = await fs.readJson(
  path.join(projectRoot, "build/mcp/docs.json"),
);
const searchIndexData = await fs.readJson(
  path.join(projectRoot, "build/mcp/search-index.json"),
);

for (const doc of Object.values(docs)) {
  doc.markdown = clean(doc.markdown);
  for (const h of doc.headings) {
    h.text = clean(h.text);
  }
}

export default createVercelHandler({
  docs,
  searchIndexData,
  name: "envio-docs",
  version: "1.0.0",
  baseUrl: "https://docs.envio.dev",
});
