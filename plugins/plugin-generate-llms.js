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
            const excludePluginIds = new Set(options.excludePluginIds || []);
            // Plugin IDs collected for the llms.txt index but kept out of
            // llms-full.txt and the per-page .md copies (e.g. legacy V2 docs).
            const excludeFromFullPluginIds = new Set(
                options.excludeFromFullPluginIds || []
            );

            let collectedDocs = [];

            // 1. collect docs metadata
            for (const plugin of plugins) {
                if (
                    Array.isArray(plugin) &&
                    plugin[0] === "@docusaurus/plugin-content-docs"
                ) {
                    const config = plugin[1];
                    if (config.id && excludePluginIds.has(config.id)) {
                        continue;
                    }
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

                        const filePath = path.join(config.path, file);
                        const relativePath = toPosix(
                            path.relative(context.siteDir, fullPath)
                        );

                        collectedDocs.push({
                            filePath,
                            relativePath,
                            title,
                            description,
                            pageUrl,
                            source: "docs",
                            pluginId: config.id || "",
                            tags: Array.isArray(parsed.data.tags)
                                ? parsed.data.tags
                                : [],
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

                        const relativePath = toPosix(
                            path.relative(context.siteDir, fullPath)
                        );

                        collectedDocs.push({
                            filePath: fullPath,
                            relativePath,
                            title,
                            description,
                            pageUrl,
                            source: "blog",
                            pluginId: "blog",
                            tags: Array.isArray(parsed.data.tags)
                                ? parsed.data.tags
                                : [],
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
                    output += `${formatDocBullet(doc)}\n`;
                }
                return output;
            }

            function formatDocBullet(doc) {
                const desc =
                    doc.description ||
                    (doc.title.length > 20
                        ? `${doc.title} section of the docs.`
                        : "");
                return `- [${doc.title}](${doc.pageUrl}.md): ${desc}`;
            }

            // Match a doc against a section/subsection node. Returns docs that
            // match include patterns + tags, minus exclude patterns, with each
            // doc claimed at most once across the whole file (first match wins).
            function selectDocs(node, claimed) {
                const include = node.include || [];
                const exclude = node.exclude || [];
                const source = node.source || "docs";
                const tags = node.tags;
                const out = [];

                for (const doc of collectedDocs) {
                    if (claimed.has(doc.relativePath)) continue;
                    if (doc.source !== source) continue;

                    if (tags && tags.length > 0) {
                        const docTags = doc.tags || [];
                        if (!tags.some((t) => docTags.includes(t))) continue;
                    }

                    if (include.length > 0) {
                        const matched = include.some((p) =>
                            minimatch(doc.relativePath, toPosix(p))
                        );
                        if (!matched) continue;
                    } else if (
                        (!tags || tags.length === 0) &&
                        !node.catchAll
                    ) {
                        // No selectors and not a catch-all → skip rather than
                        // match every doc of this source.
                        continue;
                    }

                    if (
                        exclude.some((p) =>
                            minimatch(doc.relativePath, toPosix(p))
                        )
                    ) {
                        continue;
                    }

                    out.push(doc);
                    claimed.add(doc.relativePath);
                }

                // Deterministic order: by include-pattern order, then by title
                // within each pattern bucket.
                if (node.include && node.include.length > 0) {
                    const bucketOf = (doc) => {
                        for (let i = 0; i < node.include.length; i++) {
                            if (
                                minimatch(
                                    doc.relativePath,
                                    toPosix(node.include[i])
                                )
                            )
                                return i;
                        }
                        return node.include.length;
                    };
                    out.sort((a, b) => {
                        const ba = bucketOf(a);
                        const bb = bucketOf(b);
                        if (ba !== bb) return ba - bb;
                        return a.title.localeCompare(b.title);
                    });
                } else if (node.source === "blog") {
                    // Blog filenames are date-prefixed (YYYY-MM-DD-...). Sort
                    // by relativePath descending so newest posts surface first.
                    out.sort((a, b) =>
                        b.relativePath.localeCompare(a.relativePath)
                    );
                } else {
                    out.sort((a, b) => a.title.localeCompare(b.title));
                }

                return out;
            }

            function renderLLMSStructured(cfg) {
                const {
                    header = "",
                    sections = [],
                    optional = [],
                } = cfg;
                const claimed = new Set();
                const parts = [header.trim(), ""];

                const renderLeaf = (node) => {
                    const docs = selectDocs(node, claimed);
                    if (docs.length === 0) {
                        console.warn(
                            `[plugin-generate-llms] section "${node.heading}" matched 0 docs`
                        );
                    }
                    return docs.map(formatDocBullet).join("\n");
                };

                for (const sec of sections) {
                    parts.push(`## ${sec.heading}`);
                    parts.push("");
                    if (sec.subsections && sec.subsections.length > 0) {
                        for (const sub of sec.subsections) {
                            parts.push(`### ${sub.heading}`);
                            parts.push("");
                            parts.push(renderLeaf(sub));
                            parts.push("");
                        }
                    } else {
                        parts.push(renderLeaf(sec));
                        parts.push("");
                    }
                }

                if (optional.length > 0) {
                    parts.push("## Optional");
                    parts.push("");
                    for (const o of optional) {
                        const desc = o.description ? `: ${o.description}` : "";
                        parts.push(`- [${o.label}](${o.href})${desc}`);
                    }
                    parts.push("");
                }

                return parts.join("\n");
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
                const {
                    main,
                    name,
                    root = "",
                    includeOrder = [],
                    sections,
                } = cfg;

                // Structured mode: header + sections + optional. Used when the
                // config provides explicit section grouping. Falls back to the
                // legacy flat `root` + `includeOrder` mode otherwise.
                let output;
                if (Array.isArray(sections) && sections.length > 0) {
                    output = renderLLMSStructured(cfg);
                } else {
                    const orderedDocs = orderDocs(includeOrder);
                    const tocRoot = root.trim() + "";
                    output = renderLLMS(tocRoot, orderedDocs);
                }

                // Use llms.txt for the first/main config, others as llms-<name>.txt
                const outFileName = cfg.main ? "llms.txt" : `llms-${name}.txt`;
                const outPath = path.join(context.outDir, outFileName);

                fs.writeFileSync(outPath, output, "utf-8");

                // ✅ Only run markdown copy for main config
                // Write .md copies for ALL collected docs so every link in the
                // static root text resolves — not just those in includeOrder.
                if (main) {
                    // All collected docs get .md copies so every link in
                    // llms.txt resolves. llms-full.txt is restricted further
                    // to keep V2 (and similar legacy content) out of the
                    // concatenated knowledge dump.
                    writeMarkdownCopies(collectedDocs);

                    const fullDocsPool = collectedDocs.filter(
                        (d) => !excludeFromFullPluginIds.has(d.pluginId)
                    );

                    // Generate llms-full variants: one for docs, one for blog.
                    // Agents that cannot browse mid-conversation (Claude Projects,
                    // Cursor) paste these into their context window for full recall.
                    const docsItems = fullDocsPool.filter(
                        (d) => d.source === "docs"
                    );
                    const blogItems = fullDocsPool.filter(
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
