// The version banner is rendered by src/theme/DocItem/Layout, above the doc
// layout's column row, so the article title and the right-hand TOC stay aligned
// (rendering it here, inside the content column, pushed the title out of line
// with the TOC on banner pages). This override neutralises the theme's default
// in-column banner so it doesn't render twice.
export default function DocVersionBanner() {
  return null;
}
