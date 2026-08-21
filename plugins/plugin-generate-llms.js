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
    const llmsTxtPath = options.llmsTxtPath || "/llms.txt";

    return {
        name: "docusaurus-plugin-generate-llms",

        // Inject an agent-facing directive into the HTML of every page so
        // agents discovering a single page can find the documentation index.
        // Matches the agentdocsspec "llms-txt-directive-html" check.
        injectHtmlTags() {
            return {
                headTags: [
                    {
                        tagName: "link",
                        attributes: {
                            rel: "alternate",
                            type: "text/plain",
                            href: llmsTxtPath,
                            title: "Documentation index for AI agents (llms.txt)",
                        },
                    },
                ],
                preBodyTags: [
                    {
                        tagName: "div",
                        attributes: {
                            "data-llms-directive": "true",
                            style: "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;",
                        },
                        innerHTML: `For AI agents: the documentation index is at <a href="${llmsTxtPath}">${llmsTxtPath}</a>. Markdown versions of pages are available by appending <code>.md</code> to the URL.`,
                    },
                ],
            };
        },

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
                    // Excluded plugins stay out of the llms.txt /
                    // llms-full.txt indexes but still get .md copies
                    // written, so their pages resolve when fetched
                    // directly (e.g. the *-LLM mirror bundles).
                    const indexExcluded = Boolean(
                        config.id && excludePluginIds.has(config.id)
                    );
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
                            indexExcluded,
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

            // 1c. collect standalone Docusaurus pages (src/pages/**.mdx).
            // These are real, indexed pages that the docs/blog collectors miss
            // because they are not owned by a content plugin. They have no .md
            // twin, so they are flagged hasMarkdown: false and link to the
            // plain URL.
            if (options.pages) {
                const pagesConfig =
                    typeof options.pages === "object" ? options.pages : {};
                const pagesDir = pagesConfig.path || "src/pages";
                const pagesAbsPath = path.resolve(context.siteDir, pagesDir);

                if (fs.existsSync(pagesAbsPath)) {
                    const pageFiles = glob.sync("**/*.{md,mdx}", {
                        cwd: pagesAbsPath,
                        // Partials and data files are prefixed with _ by
                        // Docusaurus convention and are not routable.
                        ignore: ["**/_*.{md,mdx}"],
                    });

                    for (const file of pageFiles) {
                        const fullPath = path.join(pagesAbsPath, file);
                        const parsed = matter(
                            fs.readFileSync(fullPath, "utf-8")
                        );
                        const title = parsed.data.title;
                        if (!title) continue;

                        const route = toPosix(file).replace(
                            /(\/index)?\.(md|mdx)$/,
                            ""
                        );

                        collectedDocs.push({
                            filePath: fullPath,
                            relativePath: toPosix(
                                path.relative(context.siteDir, fullPath)
                            ),
                            title,
                            description: parsed.data.description || "",
                            pageUrl: `${url.replace(/\/$/, "")}/${route}`,
                            source: "pages",
                            pluginId: "pages",
                            hasMarkdown: false,
                            tags: [],
                        });
                    }
                }
            }

            // 1d. collect showcase entries from the same data file that renders
            // the showcase pages, so adding a site to _data.js also lists it
            // here with no second place to update.
            if (options.showcase) {
                const showcaseConfig =
                    typeof options.showcase === "object"
                        ? options.showcase
                        : {};
                const dataPath = path.resolve(
                    context.siteDir,
                    showcaseConfig.dataPath || "src/pages/showcase/_data.js"
                );
                const routeBasePath = showcaseConfig.routeBasePath || "showcase";

                if (fs.existsSync(dataPath)) {
                    // Dynamic import rather than require: the data file is ESM
                    // and require(esm) only works on Node 20.19+, while the
                    // repo supports Node >=20.0.
                    const mod = await import(`file://${dataPath}`);
                    const sites = mod.sites || [];

                    for (const site of sites) {
                        if (!site.slug || !site.title) continue;
                        collectedDocs.push({
                            filePath: dataPath,
                            relativePath: `${toPosix(
                                path.relative(context.siteDir, dataPath)
                            )}#${site.slug}`,
                            title: site.title,
                            description: site.description || "",
                            pageUrl: `${url.replace(
                                /\/$/,
                                ""
                            )}/${routeBasePath}/${site.slug}`,
                            source: "showcase",
                            pluginId: "showcase",
                            hasMarkdown: false,
                            tags: [],
                        });
                    }
                }
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
                        if (doc.indexExcluded) continue;
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

            function formatDocBullet(doc, opts = {}) {
                // Docs and blog posts get a .md twin written by
                // writeMarkdownCopies; standalone pages and showcase entries
                // do not, so they link to the rendered URL instead.
                const href =
                    doc.hasMarkdown === false
                        ? doc.pageUrl
                        : `${doc.pageUrl}.md`;
                if (opts.compact) {
                    return `- [${doc.title}](${href})`;
                }
                const desc =
                    doc.description ||
                    (doc.title.length > 20
                        ? `${doc.title} section of the docs.`
                        : "");
                return `- [${doc.title}](${href}): ${desc}`;
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
                    if (doc.indexExcluded) continue;
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
                    const opts = { compact: !!node.compact };
                    return docs
                        .map((doc) => formatDocBullet(doc, opts))
                        .join("\n");
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
                // Discovery directive prepended to every .md copy so agents
                // fetching a single page can find the full index.
                // Matches the agentdocsspec "llms-txt-directive-md" check.
                const llmsTxtUrl = `${siteConfig.url.replace(
                    /\/$/,
                    ""
                )}/llms.txt`;
                const directive = `> For the complete documentation index, see [llms.txt](${llmsTxtUrl}).\n\n`;

                // Source files link to siblings by relative source path
                // (../Advanced/hypersync.md) and to assets by relative repo
                // path (../../static/img/sync.gif). Both break in the .md copy,
                // because the copy is served from the flattened slug URL rather
                // than its source directory. Resolve each one against the
                // source tree and rewrite it to an absolute site path.
                const byRelativePath = new Map(
                    docs.map((d) => [d.relativePath, d])
                );
                // Docs are served from a flattened slug URL, so most relative
                // links in the source resolve in URL space rather than against
                // the source tree. Both spaces are tried.
                const siteRoot = siteConfig.url.replace(/\/$/, "");
                const byUrlPath = new Map(
                    docs.map((d) => [d.pageUrl.replace(siteRoot, ""), d])
                );

                const rewriteRelativeLinks = (content, doc) => {
                    const sourceDir = path.posix.dirname(doc.relativePath);
                    const urlDir = path.posix.dirname(
                        doc.pageUrl.replace(siteRoot, "")
                    );
                    return content.replace(
                        /(\]\()(\.{1,2}\/[^)\s]+)(\))/g,
                        (match, open, target, close) => {
                            const [pathPart, hash = ""] = target.split(/(#.*)$/);
                            const resolved = path.posix.normalize(
                                path.posix.join(sourceDir, pathPart)
                            );
                            const urlResolved = path.posix.normalize(
                                path.posix.join(urlDir, pathPart)
                            );

                            // URL space first, matching how the rendered page
                            // resolves the link.
                            const urlHit =
                                byUrlPath.get(urlResolved) ||
                                byUrlPath.get(urlResolved.replace(/\.mdx?$/, ""));
                            if (urlHit) {
                                return `${open}${urlHit.pageUrl}.md${hash}${close}`;
                            }

                            // Sibling doc or blog post -> its published .md
                            // twin. Docusaurus links are commonly written
                            // without an extension (./testing), so try the
                            // usual suffixes before giving up.
                            const hit =
                                byRelativePath.get(resolved) ||
                                byRelativePath.get(`${resolved}.md`) ||
                                byRelativePath.get(`${resolved}.mdx`) ||
                                byRelativePath.get(`${resolved}/index.md`) ||
                                byRelativePath.get(`${resolved}/index.mdx`);
                            if (hit) {
                                return `${open}${hit.pageUrl}.md${hash}${close}`;
                            }

                            // static/ is served from the site root.
                            if (resolved.startsWith("static/")) {
                                return `${open}/${resolved.slice(
                                    "static/".length
                                )}${hash}${close}`;
                            }

                            console.warn(
                                `[plugin-generate-llms] ${doc.relativePath}: could not resolve relative link "${target}"`
                            );
                            return match;
                        }
                    );
                };

                for (const doc of docs) {
                    const rawContent = fs.readFileSync(doc.filePath, "utf-8");

                    // Use gray-matter to strip frontmatter
                    const parsed = matter(rawContent);
                    const cleanContent = rewriteRelativeLinks(
                        parsed.content.trimStart(),
                        doc
                    );

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
                    fs.writeFileSync(
                        targetPath,
                        directive + cleanContent,
                        "utf-8"
                    );
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
                    // Pages and showcase entries have no markdown source to
                    // copy, so they are excluded here and from llms-full.
                    writeMarkdownCopies(
                        collectedDocs.filter((d) => d.hasMarkdown !== false)
                    );

                    const fullDocsPool = collectedDocs.filter(
                        (d) =>
                            !d.indexExcluded &&
                            !excludeFromFullPluginIds.has(d.pluginId) &&
                            d.hasMarkdown !== false
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
