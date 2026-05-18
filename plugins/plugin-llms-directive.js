// Inject an llms.txt discovery directive into every HTML page.
// Surfaces:
//  - <link rel="llms-txt"> + <link rel="alternate" type="text/markdown"> in <head>
//  - A visually-hidden anchor at the very start of <body> for crawlers that
//    only scan text content for the llms.txt URL.
//
// Agents (Claude Code, Cursor, OpenCode, afdocs checkers) use these signals
// to locate the navigational index without having to guess /llms.txt.

const LLMS_URL_ABS = "https://docs.envio.dev/llms.txt";
const LLMS_FULL_URL_ABS = "https://docs.envio.dev/llms-full.txt";

function LLMSDirectivePlugin() {
  return {
    name: "envio-llms-directive",
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "llms-txt",
              href: LLMS_URL_ABS,
              type: "text/markdown",
            },
          },
          {
            tagName: "link",
            attributes: {
              rel: "alternate",
              type: "text/markdown",
              href: LLMS_URL_ABS,
              title: "llms.txt",
            },
          },
          {
            tagName: "link",
            attributes: {
              rel: "alternate",
              type: "text/markdown",
              href: LLMS_FULL_URL_ABS,
              title: "llms-full.txt",
            },
          },
          {
            tagName: "meta",
            attributes: {
              name: "llms-txt",
              content: LLMS_URL_ABS,
            },
          },
        ],
        preBodyTags: [
          `<a href="${LLMS_URL_ABS}" rel="llms-txt" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">Envio docs llms.txt — agent-facing documentation index</a>`,
        ],
      };
    },
  };
}

module.exports = LLMSDirectivePlugin;
