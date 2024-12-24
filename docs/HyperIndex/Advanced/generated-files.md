---
id: generated-files
title: Generated Indexing Files
sidebar_label: Generated Indexing Files
slug: /generated-files
---

# Generated files

The `/generated` directory contains essential files required for performing the indexing process in Envio. These files are automatically generated using the `pnpm codegen` CLI command and they should NOT be modified by the end user.

If indexing errors occur, they are likely a result of issues in the generated files, which may point to an incorrect specification in the setup files (`config.yaml`, `schema.graphql` and `EventHandlers.*`)

Once all setup file errors have been resolved, you can rerun the `pnpm codegen` command to re-generate the necessary indexing files.

The variables used in the generated files adhere to the names specified in the configuration and schema files during the initial setup. This ensures consistency between the generated files and the contracts, events, and entities defined in the configuration and schema.

The generated files are initially created in ReScript and then compiled to JavaScript (`.bs.js` extension) for runtime execution.


---
