---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
slug: /quickstart
---

# Quickstart

## Installation

Follow the installation steps outlined [<ins>here</ins>](./installation).

## Initialise your indexer

`cd` into the folder of your choice and run

```bash
envio init
```

Then choose a template out of the possible options

```bash
? Which template would you like to use?
> "Blank"
  "Greeter"
  "Erc20"
[↑↓ to move, enter to select, type to filter]
```

Then choose a language from **Javascript**, **Typescript** or **Rescript** to write the event handlers file.

```bash
? Which language would you like to use?
> "Javascript"
  "Typescript"
  "Rescript"
[↑↓ to move, enter to select, type to filter]
```

This will create the config, schema and event handlers files according to the template and language chosen.

## Specify the config and schema files according to your project

Now you can configure the files to your configuration.
This step can be skipped if you want to continue building an indexer with the template chosen in the previous step.

- How to specify the [<ins>config</ins>](./configuration-file) file.
- How to specify the [<ins>schema</ins>](./schema) file.

## Generate code for your indexer

Once you have specified the config and schema files, you are ready to generate the files required for indexing.

You can run:

```bash
envio codegen
```

## Write the event handlers for your project

Once the indexing files have been generated, you are ready to write the event handlers for your project.

Click [<ins>here</ins>](./event-handlers) for a guide on how to define your event handlers.

## Run the indexer locally

Install the relevant packages


Run Docker for local environments and set up the database
```bash
envio local docker up
envio local db-migrate setup

```

Run the indexer

```bash
envio start
```

## Open the Hasura dashboard

<!-- ```bash
pnpm open-dashboard
``` -->

<!-- todo, swap the bellow command with above -->

Open the [<ins>local hasura server</ins>](http://localhost:8080/console).

Admin-secret for local Hasura is `testing`

Alternatively you can open the file `index.html` for a cleaner experience (no Hasura stuff). Unfortunately, Hasura is currently not configured to make the data public.

---
