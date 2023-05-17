---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
slug: /quick-start
---



# Quickstart

## Create templates

`cd` into folder of your choice and run 
```
envio init
```

Then choose a template out of the possible options
```
? Which template would you like to use?  
> "Gravatar"
[↑↓ to move, enter to select, type to filter]
```
Then choose a language from Javascript, Typescript or Rescript to write the event handlers file.
```
? Which javascript flavor would you like to use?  
> "Javascript"
  "Typescript"
  "Rescript"
[↑↓ to move, enter to select, type to filter
```

This will generate the config, schema and event handlers files according to the template and flavour chosen.

## Configure the files according to your project

- How to specify the config file [here](configuration-file.md).
- How to specify the schema file [here](schema.md).
- How to specify the event handlers file [here](event-handlers.md).

## Generate code according to configuration

Once you have configured the above files, the following can be used generate all the code that is required for indexing your project:

```
envio codegen
```

## Run the indexer
Once all the configuration files and auto-generated files are in place, you are ready to run the indexer for your project:
```
pnpm start
```

## View the database
To view the data in the database, run
```
./generated/register_tables_with_hasura.sh
```
and open http://localhost:8080/console.

Admin-secret for local Hasura is `testing` 

Alternatively you can open the file `index.html` for a cleaner experience (no Hasura stuff). Unfortunately, Hasura is currently not configured to make the data public.

---