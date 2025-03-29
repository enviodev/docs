# LLM-Friendly Documentation Setup

This project includes a special build configuration for creating LLM-friendly documentation that excludes the large number of auto-generated supported network pages.

## How It Works

1. The build process checks for the `DOCS_FOR_LLM` environment variable
2. When `DOCS_FOR_LLM=true`:
   - The sidebar code in `sidebarsHyperIndex.js` directly filters to show only important networks
   - Canonical URLs are added to tell search engines that docs.envio.dev is the primary source

## Implementation Details

Our approach is simple and efficient:

1. **Sidebar Filtering**: We filter the networks list directly in `sidebarsHyperIndex.js` when the environment variable is present, showing only the most important networks.

2. **Canonical URLs**: A custom Docusaurus plugin adds canonical links to all pages, pointing to the main docs site.

3. **No File Modifications**: All markdown files are still generated normally, we just control what appears in the navigation.

## SEO Considerations

The LLM-friendly version (llm-docs.envio.dev) includes canonical links pointing to the main documentation site (docs.envio.dev). This ensures:

1. Search engines know which version to index (the main docs)
2. The LLM version won't cause SEO penalties for duplicate content
3. Users who find the LLM version through direct links will still get a good experience

## Vercel Setup Instructions

To set up the LLM-friendly documentation in Vercel:

1. **Create a new Environment in Vercel**:

   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add a new Environment Variable:
     - Name: `DOCS_FOR_LLM`
     - Value: `true`
   - Apply this to your LLM documentation environment

2. **Set Up Custom Domain**:
   - Add your custom domain: `llm-docs.envio.dev`
   - Vercel will provide DNS setup instructions

## Local Testing

To test the LLM-friendly build locally:

```bash
# Run with LLM mode enabled
DOCS_FOR_LLM=true yarn start

# Run normal mode (full documentation)
yarn start
```

## Files Modified for This Feature

1. `sidebarsHyperIndex.js` - Contains logic to filter networks when DOCS_FOR_LLM is true
2. `docusaurus.config.js` - Adds canonical URL support via a custom plugin

## Maintenance Notes

- When adding new networks, no changes are needed for the LLM version
- The filtered networks are defined in `sidebarsHyperIndex.js` in the `keyNetworks` array
- Canonical URLs are automatically generated via the custom plugin in `docusaurus.config.js`
