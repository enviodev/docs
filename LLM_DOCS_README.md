# LLM-Friendly Documentation Setup

This project includes a special build configuration for creating LLM-friendly documentation that consolidates all documentation into single files for easier consumption by Large Language Models.

## How It Works

1. The build process consolidates all HyperIndex and HyperSync documentation into single MDX files
2. Blog content is completely excluded from the LLM documentation
3. Creates a streamlined documentation site optimized for LLM context windows
4. Provides separate consolidated files for HyperIndex and HyperSync documentation
5. All internal links and problematic content are cleaned up for LLM consumption

## Structure

- `docs/HyperIndex-LLM/hyperindex-complete.mdx` - All HyperIndex documentation in one file
- `docs/HyperSync-LLM/hypersync-complete.mdx` - All HyperSync documentation in one file
- `docusaurus.config.llm.js` - Special configuration for LLM docs
- `scripts/consolidate-hyperindex-docs.js` - Script to consolidate documentation

## Usage

### Building LLM Documentation

```bash
# Build the LLM documentation
yarn build-llm

# Start the LLM documentation server
yarn start-llm

# Consolidate documentation files
yarn consolidate-docs
```

### Accessing the Documentation

Once built, you can access:

- HyperIndex documentation at `/docs/HyperIndex-LLM/hyperindex-complete`
- HyperSync documentation at `/docs/HyperSync-LLM/hypersync-complete`

## Features

- **Single File Per Product**: All HyperIndex docs in one file, all HyperSync docs in another
- **No Blog Content**: Blog posts are completely excluded
- **Clean Content**: Internal links, images, and problematic syntax are removed
- **LLM Optimized**: Content is structured for easy LLM consumption
- **Separate Build**: Uses a separate docusaurus configuration to avoid conflicts

## Scripts

- `yarn build-llm` - Build the LLM documentation
- `yarn start-llm` - Start the development server for LLM docs
- `yarn consolidate-docs` - Regenerate the consolidated documentation files

## Configuration

The LLM documentation uses a separate docusaurus configuration (`docusaurus.config.llm.js`) that:

- Disables blog functionality
- Uses simplified sidebar configurations
- Focuses only on the consolidated documentation files
- Optimizes for LLM consumption

## File Processing

The consolidation script:

- Processes all markdown and MDX files from the source directories
- Removes internal links and references
- Cleans up problematic syntax
- Maintains content structure for LLM consumption
- Generates clean MDX files

This setup provides a clean, consolidated documentation experience perfect for LLM context windows and automated processing.
