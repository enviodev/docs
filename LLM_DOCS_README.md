# LLM-Friendly Documentation Setup

This project includes a special build configuration for creating LLM-friendly documentation that excludes the large number of auto-generated supported network pages.

## How It Works

1. The build process checks for the `DOCS_FOR_LLM` environment variable
2. When `DOCS_FOR_LLM=true`, the build:
   - Skips generating all supported network pages
   - Creates a minimal list of important networks
   - Produces a streamlined documentation site optimized for LLM context windows

## Vercel Setup Instructions

To set up the LLM-friendly documentation in Vercel:

1. **Create a new Environment in Vercel**:

   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add a new Environment Variable:
     - Name: `DOCS_FOR_LLM`
     - Value: `true`
   - In the "Environments" dropdown, select only the environment you want for LLM docs (e.g., "Preview")

2. **Create a Preview Deployment**:

   - In Vercel, go to Deployments
   - Create a new deployment
   - Select your repository and branch
   - Choose the environment where `DOCS_FOR_LLM=true`
   - Deploy

3. **Alternative: Create a Git Branch**:
   - Create a branch named `llm-docs` in your repository
   - Configure Vercel to use the `DOCS_FOR_LLM=true` environment variable for this branch
   - Vercel will automatically deploy with the LLM-friendly configuration

## Local Testing

To test the LLM-friendly build locally:

```bash
# Run with LLM mode enabled
DOCS_FOR_LLM=true yarn start

# Run normal mode (full documentation)
yarn start
```

## Files Modified for This Feature

1. `scripts/conditionally-update-endpoints.js` - Conditionally generates network pages
2. `package.json` - Updated build scripts to use the conditional script
3. `sidebarsHyperIndex.js` - Modified to conditionally include networks in the sidebar

## Maintenance Notes

When adding new features or sections to the documentation, consider whether they should be included in both versions or just the full version.
