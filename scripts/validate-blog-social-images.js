#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const blogDir = path.join(repoRoot, "blog");
const staticDir = path.join(repoRoot, "static");
const ENFORCE_IMAGE_FROM_DATE = "2026-03-20";

function getMarkdownFiles(dirPath) {
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(dirPath, entry.name));
}

function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }

  const frontmatter = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();
    value = value.replace(/^["']|["']$/g, "");
    frontmatter[key] = value;
  }

  return frontmatter;
}

function toStaticFilePath(imagePath) {
  if (!imagePath.startsWith("/")) {
    return null;
  }
  const base = path.resolve(staticDir);
  const resolvedPath = path.resolve(staticDir, imagePath.slice(1));
  if (resolvedPath === base || resolvedPath.startsWith(base + path.sep)) {
    return resolvedPath;
  }
  return null;
}

function main() {
  const blogFiles = getMarkdownFiles(blogDir);
  const errors = [];
  const warnings = [];

  for (const blogFile of blogFiles) {
    const filename = path.basename(blogFile);
    const dateMatch = filename.match(/^(\d{4})-(\d{2})-(\d{1,2})-/);
    const postDate = dateMatch
      ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3].padStart(2, "0")}`
      : null;
    const shouldRequireImage =
      postDate === null || postDate >= ENFORCE_IMAGE_FROM_DATE;

    const relativePath = path.relative(repoRoot, blogFile);
    const content = fs.readFileSync(blogFile, "utf8");
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
      errors.push(`${relativePath}: missing frontmatter block`);
      continue;
    }

    const slug = frontmatter.slug;
    if (!slug) {
      errors.push(`${relativePath}: missing 'slug' in frontmatter`);
    } else if (slug.startsWith("/blog/")) {
      errors.push(
        `${relativePath}: slug must not start with '/blog/' (found '${slug}')`,
      );
    }

    const image = frontmatter.image;
    if (!image) {
      const message = `${relativePath}: missing 'image' in frontmatter`;
      if (shouldRequireImage) {
        errors.push(message);
      } else {
        warnings.push(message);
      }
      continue;
    }

    if (!image.startsWith("/")) {
      errors.push(
        `${relativePath}: image must be an absolute static path (found '${image}')`,
      );
      continue;
    }

    const staticFilePath = toStaticFilePath(image);
    if (!staticFilePath || !fs.existsSync(staticFilePath)) {
      errors.push(
        `${relativePath}: image file not found at 'static/${image.slice(1)}'`,
      );
    }
  }

  if (errors.length > 0) {
    console.error("Blog social-image validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  if (warnings.length > 0) {
    const previewLimit = 10;
    console.warn(
      `Blog social-image validation warnings (${warnings.length} legacy posts):`,
    );
    for (const warning of warnings.slice(0, previewLimit)) {
      console.warn(`- ${warning}`);
    }
    if (warnings.length > previewLimit) {
      console.warn(`- ...and ${warnings.length - previewLimit} more`);
    }
  }

  console.log(`Validated ${blogFiles.length} blog posts: social images look good.`);
}

main();
