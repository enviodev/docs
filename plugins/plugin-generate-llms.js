const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const glob = require("glob");
const _minimatch = require("minimatch");
const minimatch = typeof _minimatch === "function" ? _minimatch : _minimatch.minimatch;

// Docusaurus Plugin: Generate LLMS files
// --------------------------------------
// This plugin generates `llms.txt` (and optional variants) during the Docusaurus build.
// It is designed for integrating with LLMs or tools that need a structured list of docs
// in text/Markdown format.
//
// What it does:
//  1. Scans all docs from `@docusaurus/plugin-content-docs`.
//  2. Collects metadata (title, slug, description, URL).
//  3. Orders docs according to `includeOrder` patterns (glob-like).
//  4. Writes an `llms.txt` file (or multiple) into the build output folder.
//  5. Optionally writes stripped-down `.md` copies of the docs (without frontmatter).
//
// How to use:
// -----------
// In your `docusaurus.config.js`, add the plugin with configuration:
//
// plugins: [
//   [
//     require.resolve("./plugins/generate-llms"),   // path to this plugin file
//     {
//       filesConfigs: [
//         {
//           main: true,                  // Marks this as the main config
//           name: "default",             // Identifier (used for filename if not main)
//           root: "Welcome to the docs!",// Text that appears at the top of llms.txt
//           includeOrder: [              // Order of docs (glob patterns)
//             "**/intro.md",
//             "**/getting-started.md",
//             "**/guides/*",
//           ],
//         },
//         {
//           main: false,                 // Optional secondary config
//           name: "advanced",            // Will output as llms-advanced.txt
//           root: "Advanced Topics",     // Intro text
//           includeOrder: [
//             "**/advanced/*",
//             "**/api/*",
//           ],
//         },
//       ],
//     },
//   ],
// ],
//
// Output:
// -------
// - `build/llms.txt` (main file, always generated if `main: true` exists).
// - `build/llms-<name>.txt` (for secondary configs).
// - `build/.../*.md` stripped copies of docs (only for the main config).
//
// Notes:
// - Paths in `includeOrder` are matched against doc file paths, so you can use wildcards.
// - The `.md` copies are saved at the same relative path as the doc's URL.

function GenerateLLMSPlugin(context, options) {
    return {
        name: "docusaurus-plugin-generate-llms",

        async postBuild({ siteConfig }) {
            const { url, plugins } = siteConfig;

            const filesConfigs = options.filesConfigs || [];

            let collectedDocs = [];

            // 1. collect docs metadata
            for (const plugin of plugins) {
                if (
                    Array.isArray(plugin) &&
                    plugin[0] === "@docusaurus/plugin-content-docs"
                ) {
                    const config = plugin[1];
                    const docsPath = path.resolve(config.path);
                    const routeBasePath = config.routeBasePath || "";

                    const allFiles = glob.sync("**/*.{md,mdx}", {
                        cwd: docsPath,
                    });

                    for (const file of allFiles) {
                        const fullPath = path.join(docsPath, file);
                        const raw = fs.readFileSync(fullPath, "utf-8");
                        const parsed = matter(raw);

                        const slug = parsed.data.slug;
                        const title = parsed.data.title;
                        const description = parsed.data.description || "";

                        if (!slug || !title) continue;

                        const pageUrl = `${url.replace(
                            /\/$/,
                            ""
                        )}/${routeBasePath.replace(/^\//, "")}/${slug.replace(
                            /^\//,
                            ""
                        )}`;

                        collectedDocs.push({
                            filePath: path.join(config.path, file),
                            title,
                            description,
                            pageUrl,
                            source: "docs",
                        });
                    }
                }
            }

            // 1b. collect blog posts (classic preset registers plugin-content-blog
            // under presets, not plugins, so we resolve the source dir from options).
            if (options.blog) {
                const blogConfig =
                    typeof options.blog === "object" ? options.blog : {};
                const blogDir = blogConfig.path || "blog";
                const blogRouteBasePath = blogConfig.routeBasePath || "blog";
                const blogAbsPath = path.resolve(context.siteDir, blogDir);

                if (fs.existsSync(blogAbsPath)) {
                    const blogFiles = glob.sync("**/*.{md,mdx}", {
                        cwd: blogAbsPath,
                        // Authors / tags metadata lives alongside posts but isn't a post.
                        ignore: ["**/authors.{md,mdx}", "**/tags.{md,mdx}"],
                    });

                    for (const file of blogFiles) {
                        const fullPath = path.join(blogAbsPath, file);
                        const raw = fs.readFileSync(fullPath, "utf-8");
                        const parsed = matter(raw);

                        const title = parsed.data.title;
                        const description = parsed.data.description || "";
                        if (!title) continue;

                        // Blog posts may declare an explicit slug, otherwise Docusaurus
                        // derives one from the filename (YYYY-MM-DD-slug pattern).
                        let slug = parsed.data.slug;
                        if (!slug) {
                            const base = path.basename(
                                file,
                                path.extname(file)
                            );
                            // Folder-style posts (YYYY-MM-DD-slug/index.md) expose
                            // "index" as the basename; fall back to the parent
                            // directory name so the date prefix is still stripped
                            // and each folder post gets its own unique slug.
                            const candidate =
                                base === "index"
                                    ? path.basename(path.dirname(file))
                                    : base;
                            const m = candidate.match(
                                /^\d{4}-\d{2}-\d{2}-(.+)$/
                            );
                            slug = m ? m[1] : candidate;
                        }

                        const pageUrl = `${url.replace(
                            /\/$/,
                            ""
                        )}/${blogRouteBasePath.replace(
                            /^\//,
                            ""
                        )}/${slug.replace(/^\//, "")}`;

                        collectedDocs.push({
                            filePath: fullPath,
                            title,
                            description,
                            pageUrl,
                            source: "blog",
                        });
                    }
                }
            }

            // Helper to convert Windows paths to POSIX
            function toPosix(p) {
                return p.split(path.sep).join("/");
            }

            function orderDocs(includeOrder) {
                if (!includeOrder || includeOrder.length === 0) {
                    return [];
                }

                const matched = new Set();
                const ordered = [];
                const duplicates = new Set();

                for (const pattern of includeOrder) {
                    for (const doc of collectedDocs) {
                        const docPath = toPosix(doc.filePath);
                        const pat = toPosix(pattern);

                        if (minimatch(docPath, pat)) {
                            if (matched.has(doc.filePath)) {
                                duplicates.add(doc.filePath);
                            } else {
                                ordered.push(doc);
                                matched.add(doc.filePath);
                            }
                        }
                    }
                }

                return ordered;
            }

            function renderLLMS(rootText, docs) {
                let output = rootText.trim() + "\n\n";
                for (const doc of docs) {
                    const desc =
                        doc.description ||
                        (doc.title.length > 20
                            ? `${doc.title} section of the docs.`
                            : "");
                    output += `- [${doc.title}](${doc.pageUrl}.md): ${desc}\n`;
                }
                return output;
            }

            // Concatenate every item's stripped markdown content into a single
            // file with source URL delimiters. Agents (Claude Projects, Cursor)
            // can paste the whole file in as knowledge-base context.
            function renderLLMSFull(items, header) {
                const parts = [header.trim(), ""];
                for (const item of items) {
                    const raw = fs.readFileSync(item.filePath, "utf-8");
                    const body = matter(raw).content.trimStart();
                    parts.push(`<!-- source: ${item.pageUrl} -->`);
                    parts.push(`# ${item.title}`);
                    if (item.description) parts.push(`\n> ${item.description}`);
                    parts.push("");
                    parts.push(body.trimEnd());
                    parts.push("");
                    parts.push("---");
                    parts.push("");
                }
                return parts.join("\n");
            }

            // --- NEW: write .md copies into build folder ---
            function writeMarkdownCopies(docs) {
                for (const doc of docs) {
                    const rawContent = fs.readFileSync(doc.filePath, "utf-8");

                    // Use gray-matter to strip frontmatter
                    const parsed = matter(rawContent);
                    const cleanContent = parsed.content.trimStart();

                    // Convert pageUrl to relative path inside build
                    let relativePath = doc.pageUrl.replace(
                        siteConfig.url.replace(/\/$/, ""),
                        ""
                    );
                    relativePath = relativePath.replace(/^\//, "");

                    // Save as .md file (same path as page, but with .md)
                    const targetPath = path.join(
                        context.outDir,
                        `${relativePath}.md`
                    );

                    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
                    fs.writeFileSync(targetPath, cleanContent, "utf-8");
                }
            }

            // 2. generate files
            for (const cfg of filesConfigs) {
                const { main, name, root = "", includeOrder = [] } = cfg;

                // Order docs based on includeOrder patterns
                const orderedDocs = orderDocs(includeOrder);

                // Inject "## Table of Contents" after root text
                const tocRoot = root.trim() + "";

                const output = renderLLMS(tocRoot, orderedDocs);

                // Use llms.txt for the first/main config, others as llms-<name>.txt
                const outFileName = cfg.main ? "llms.txt" : `llms-${name}.txt`;
                const outPath = path.join(context.outDir, outFileName);

                fs.writeFileSync(outPath, output, "utf-8");

                // ✅ Only run markdown copy for main config
                // Write .md copies for ALL collected docs so every link in the
                // static root text resolves — not just those in includeOrder.
                if (main) {
                    writeMarkdownCopies(collectedDocs);

                    // Generate llms-full variants: one for docs, one for blog.
                    // Agents that cannot browse mid-conversation (Claude Projects,
                    // Cursor) paste these into their context window for full recall.
                    const docsItems = collectedDocs.filter(
                        (d) => d.source === "docs"
                    );
                    const blogItems = collectedDocs.filter(
                        (d) => d.source === "blog"
                    );

                    if (docsItems.length > 0) {
                        const header =
                            `# Envio: Full Documentation for LLMs\n\n` +
                            `> Every page of docs.envio.dev concatenated as markdown, ` +
                            `with per-page source URLs, for direct ingestion into ` +
                            `LLM context windows. Pair with https://docs.envio.dev/llms.txt ` +
                            `for the navigational index.`;
                        const content = renderLLMSFull(docsItems, header);
                        fs.writeFileSync(
                            path.join(context.outDir, "llms-full.txt"),
                            content,
                            "utf-8"
                        );
                    }

                    if (blogItems.length > 0) {
                        const header =
                            `# Envio: Full Blog and Case Studies for LLMs\n\n` +
                            `> Every blog post and case study on docs.envio.dev ` +
                            `concatenated as markdown, with per-page source URLs. ` +
                            `Pair with https://docs.envio.dev/llms-full.txt for ` +
                            `technical documentation.`;
                        const content = renderLLMSFull(blogItems, header);
                        fs.writeFileSync(
                            path.join(context.outDir, "llms-full-blog.txt"),
                            content,
                            "utf-8"
                        );
                    }
                }
            }
        },
    };
}

module.exports = GenerateLLMSPlugin;
