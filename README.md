# Envio Documentation

Welcome to the documentation source for Envio. This project utilizes [Docusaurus](https://docusaurus.io/), a modern static website generator, to create and manage the documentation efficiently.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>=18.0)
- [Yarn](https://yarnpkg.com/)

## Installation

To set up the project locally, follow these steps:

```bash
yarn install
```

This will install all the necessary dependencies to run the Docusaurus project.

## Local Development

To start a local development server and open up a browser window, use:

```bash
yarn start
```

Most changes are reflected live without having to restart the server.

## Build

To build the static content for the project, run:

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

If you are ready to deploy your documentation site, use:

```bash
yarn deploy
```

This command builds the static content and deploys it to the specified `deploy` branch on GitHub.

## Other Commands

- `yarn swizzle`: This command can be used to "swizzle" any Docusaurus theme components, allowing for customization beyond the default configuration.
- `yarn serve`: To serve your static site after it has been built, you can use this command.
- `yarn clear`: To clear the cache used by Docusaurus, use this command.
- `yarn write-translations`: To extract the site's text and create JSON files for translation, use this command.

## Documentation Structure

The documentation content files are primarily written in Markdown and located in the `/docs` directory. Modify or add new documents as needed to update the site's content.

## More Information

For more detailed instructions on managing and customizing your Docusaurus site, refer to the [official Docusaurus documentation](https://docusaurus.io/docs).

Thank you for contributing to the Envio documentation!
