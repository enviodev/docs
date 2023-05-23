---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
slug: /quickstart
---



# Quickstart

## Installation

```bash
npm i -g envio
```

## Initialise your indexer

`cd` into the folder of your choice and run 
```bash
npx envio init
```

Then choose a template out of the possible options
```bash
? Which template would you like to use?  
> "Greeter"
[↑↓ to move, enter to select, type to filter]
```
Then choose a language from **Javascript**, **Typescript** or **Rescript** to write the event handlers file.
```bash
? Which javascript flavor would you like to use?  
> "Javascript"
  "Typescript"
  "Rescript"
[↑↓ to move, enter to select, type to filter]
```

This will generate the config, schema and event handlers files according to the template and language chosen.
## Generate code for your indexer

```bash
npx envio codegen
```

## Run the indexer locally

Install the relevant packages
```bash
pnpm i
```
Run the indexer
```bash
pnpm start
```
## Open the Hasura dashboard
<!-- ```bash
pnpm open-dashboard
``` -->

<!-- todo, swap the bellow command with above -->

```bash
./generated/register_tables_with_hasura.sh
```
and open the [<ins>local hasura server</ins>](http://localhost:8080/console).

Admin-secret for local Hasura is `testing` 

Alternatively you can open the file `index.html` for a cleaner experience (no Hasura stuff). Unfortunately, Hasura is currently not configured to make the data public.

## Configure the files according to your project
Now you can configure the files to your configuration

- How to specify the config file [<ins>here</ins>](./configuration-file).
- How to specify the schema file [<ins>here</ins>](./schema).
- How to specify the event handlers file [[<ins>here</ins>](./event-handlers).


---