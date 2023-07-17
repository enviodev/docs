---
id: generated-files
title: Generated Files
sidebar_label: Generated Files
slug: /generated-files
---

# Generated files

The `/generated/src` directory contains essential files required for performing the indexing process in Envio. These files are automatically generated using the `envio codegen` CLI command, and it's important to note that they should not be modified by end users.

If indexing errors occur, they are likely a result of issues in the setup files. In such cases, it is crucial to identify and resolve these setup file errors to ensure accurate indexing.

Once all setup file errors have been resolved, you can rerun the `envio codegen` command to regenerate the necessary files.

The variables used in the generated files adhere to the names specified in the configuration and schema files during the initial setup. This ensures consistency between the generated files and the contracts, events, and entities defined in the configuration and schema.

It's worth mentioning that the generated files are initially created in ReScript and then compiled to JavaScript for runtime execution.

Please note that the provided information is a brief overview of the generated files in Envio.

---