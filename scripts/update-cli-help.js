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
