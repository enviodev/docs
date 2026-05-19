// Vercel routing middleware: serve markdown when the client asks for it.
//
// Agents (Claude Code, Cursor, OpenCode) send `Accept: text/markdown` to
// request the plain-text version of a page. The build emits a `<page>.md`
// alongside every documentation page; here we rewrite the request to that
// file while keeping the canonical URL unchanged.
//
// Conditional rewrites in vercel.json don't reliably intercept before the
// static filesystem on Docusaurus deployments, so we handle the negotiation
// in middleware where the precedence is well-defined.

export const config = {
  matcher: ["/docs/:path+", "/blog/:slug"],
};

export default function middleware(request) {
  const accept = request.headers.get("accept") || "";
  if (!/text\/markdown/i.test(accept)) {
    return;
  }

  const url = new URL(request.url);
  const cleanPath = url.pathname.replace(/\/$/, "");
  // If the client already asked for the .md URL directly, let it through
  // unchanged — appending another .md would 404.
  if (cleanPath.endsWith(".md")) {
    return;
  }
  const rewriteUrl = new URL(`${cleanPath}.md`, url);

  return new Response(null, {
    headers: {
      "x-middleware-rewrite": rewriteUrl.toString(),
    },
  });
}
