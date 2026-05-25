import { createVercelHandler } from "docusaurus-plugin-mcp-server/adapters";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

export default createVercelHandler({
  docsPath: path.join(projectRoot, "build/mcp/docs.json"),
  indexPath: path.join(projectRoot, "build/mcp/search-index.json"),
  name: "envio-docs",
  version: "1.0.0",
  baseUrl: "https://docs.envio.dev",
});
