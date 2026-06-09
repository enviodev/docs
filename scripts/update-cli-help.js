// Assemble the Envio CLI reference page.
//
// The page is built from two parts:
//   1. A curated template (scripts/cli-help/cli-commands.template.md) holding
//      the frontmatter and all hand-written prose (intro, tips, command
//      overview, reference table, examples). Edit this freely.
//   2. The per-command reference, fetched from hyperindex's upstream
//      CommandLineHelp.md and injected at the ENVIO_CLI_HELP marker, so the
//      command details always match the real CLI surface.
//
// Run with `yarn update-cli-help`.
const path = require("path");
const fs = require("fs");

const DOC_URL =
  "https://raw.githubusercontent.com/enviodev/hyperindex/main/packages/cli/CommandLineHelp.md";

// Marker in the template that gets replaced with the upstream command reference.
const HELP_MARKER = "<!-- ENVIO_CLI_HELP -->";

const TEMPLATE_PATH = path.join(__dirname, "cli-help/cli-commands.template.md");

const OUTPUT_FILE_PATH = path.join(
  __dirname,
  "../docs/HyperIndex/Guides/cli-commands.md",
);

// Drop only the upstream H1 and the "This document contains…" blurb so they
// don't duplicate the curated intro. We keep everything from the upstream
// "Command Overview" onward (its overview list + every per-command section),
// reusing as much of the original CLI help as possible.
function extractCommandReference(doc) {
  const overview = doc.indexOf("**Command Overview:**");
  if (overview !== -1) {
    return doc.slice(overview).trim();
  }
  // Fallback: if upstream drops the overview block, keep from the first
  // per-command section so we still emit a usable reference.
  const firstSection = doc.indexOf("\n## ");
  if (firstSection === -1) {
    throw new Error(
      `Could not find a "Command Overview" or any command section ("## ") ` +
        `in the upstream help. Its format may have changed: ${DOC_URL}`,
    );
  }
  return doc.slice(firstSection + 1).trim();
}

const main = async () => {
  const template = await fs.promises.readFile(TEMPLATE_PATH, "utf-8");
  const markerCount = template.split(HELP_MARKER).length - 1;
  if (markerCount !== 1) {
    throw new Error(
      `Template ${TEMPLATE_PATH} must contain exactly one ${HELP_MARKER} ` +
        `marker, found ${markerCount}.`,
    );
  }

  const response = await fetch(DOC_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch CLI help from ${DOC_URL}: ${response.status} ${response.statusText}`,
    );
  }

  const commandReference = extractCommandReference(await response.text());
  const combinedContent = template.replace(HELP_MARKER, commandReference);

  await fs.promises.writeFile(OUTPUT_FILE_PATH, combinedContent);
  console.log(`Combined content has been written to ${OUTPUT_FILE_PATH}`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
