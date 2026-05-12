// Help doc on main
const path = require("path");
const fs = require("fs");

const DOC_URL =
  "https://raw.githubusercontent.com/enviodev/hyperindex/main/codegenerator/cli/CommandLineHelp.md";

const PAGE_HEADER = `---
id: cli-commands
title: Envio CLI
sidebar_label: Envio CLI
slug: /cli-commands
---

`;

// CommandLineHelp.md is published by hyperindex; we mirror it into the V3
// docs page. Repoint DOC_URL above at the V3 release tag/branch when one is
// available so this stays in sync with the V3 CLI surface.
const OUTPUT_FILE_PATH = path.join(
  __dirname,
  "../docs/HyperIndex/Guides/cli-commands.md",
);

const main = async () => {
  const response = await fetch(DOC_URL);
  const doc = await response.text();
  const combinedContent = PAGE_HEADER + doc;
  await fs.promises.writeFile(OUTPUT_FILE_PATH, combinedContent);
  console.log(`Combined content has been written to ${OUTPUT_FILE_PATH}`);
};

main();
