import React, {useState, useRef, useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';

const MCP_URL = 'https://docs.envio.dev/mcp';

// One-click MCP-server install deep links (config pre-encoded for each editor).
const CURSOR_DEEPLINK =
  'cursor://anysphere.cursor-deeplink/mcp/install?name=envio-docs&config=eyJ1cmwiOiJodHRwczovL2RvY3MuZW52aW8uZGV2L21jcCJ9';
const VSCODE_DEEPLINK =
  'vscode:mcp/install?%7B%22name%22%3A%22envio-docs%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fdocs.envio.dev%2Fmcp%22%7D';
// Codex sets up MCP via ~/.codex/config.toml, so we copy a ready-to-paste block.
const CODEX_CONFIG = `[mcp_servers.envio_docs]
command = "npx"
args = ["-y", "mcp-remote", "https://docs.envio.dev/mcp"]`;

/* --- Icons (inline SVG so they stay self-contained + theme-aware) ------ */
const svg = (props) => ({
  width: 17,
  height: 17,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  ...props,
});

function CopyIcon() {
  return (
    <svg {...svg({fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'})}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg {...svg({fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round'})}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function MarkdownIcon() {
  return (
    <svg {...svg({fill: 'currentColor'})}>
      <path d="M22.27 19.385H1.73A1.73 1.73 0 0 1 0 17.655V6.345a1.73 1.73 0 0 1 1.73-1.73h20.54A1.73 1.73 0 0 1 24 6.345v11.31a1.73 1.73 0 0 1-1.73 1.73zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.46v7.847zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.461 4.039z" />
    </svg>
  );
}
function OpenAIIcon() {
  return (
    <svg {...svg({fill: 'currentColor'})}>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.998-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.08 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.677l5.815 3.354-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.856-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.307 12.863l-2.02-1.164a.08.08 0 0 1-.038-.057V6.074a4.5 4.5 0 0 1 7.376-3.454l-.142.08L8.704 5.46a.795.795 0 0 0-.393.68zm1.098-2.365 2.602-1.5 2.607 1.5v3l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}
function ClaudeIcon() {
  return (
    <svg {...svg({fill: 'currentColor'})}>
      <path d="M4.709 15.955l4.72-2.647.079-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.365-.462-.158-1.008.656-.722.881.06.225.061 2.213 1.688 1.351.99 1.766 1.302.259.157.103-.074.013-.051-.116-.194-.962-1.74-1.028-1.773-.457-.734-.121-.44a2.13 2.13 0 0 1-.073-.518l.749-1.017.414-.133.998.134.42.364.622 1.42 1.009 2.243 1.566 3.051.457.905.245.837.091.256h.159v-.147l.128-1.717.237-2.11.23-2.717.08-.765.376-.91.75-.494.585.28.483.689-.067.445-.286 1.856-.559 2.906-.364 1.948h.212l.243-.242.983-1.305 1.65-2.064.728-.819.85-.905.547-.43h1.033l.76 1.128-.34 1.165-1.063 1.347-.881 1.142-1.263 1.7-.79 1.36.073.11.188-.02 2.856-.607 1.543-.28 1.841-.315.833.388.091.395-.328.806-1.967.487-2.307.461-3.436.813-.043.03.05.061 1.548.146.662.036h1.619l3.018.225.79.522.473.639-.079.485-1.214.618-1.64-.388-3.826-.911-1.312-.327h-.181v.109l1.093 1.069 2.006 1.81 2.509 2.33.127.578-.321.455-.34-.048-2.204-1.657-.85-.746-1.926-1.62h-.126v.17l.443.648 2.343 3.522.121 1.08-.169.354-.606.212-.668-.121-1.374-1.926-1.415-2.166-1.14-1.943-.14.08-.674 7.253-.316.37-.729.281-.607-.462-.322-.746.322-1.476.389-1.924.315-1.53.286-1.899.169-.632-.011-.042-.14.018-1.434 1.967-2.18 2.945-1.723 1.845-.415.164-.716-.371.067-.662.4-.589 2.389-3.035 1.44-1.883.929-1.085-.006-.159h-.055L4.132 18.56l-1.13.145-.487-.455.06-.746.232-.243 1.907-1.311z" />
    </svg>
  );
}
function PerplexityIcon() {
  return (
    <svg {...svg({fill: 'currentColor'})}>
      <path d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.785 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.271h-6.386l4.542 4.123v4.15zm-8.5-8.202H4.478v8.275h1.844v-4.15l4.743-4.125zM5.469 3.383v3.516l5.454 4.955.53-.481-5.984-7.99zm13.028 0l-5.632 7.99.53.482 5.102-4.635V3.383z" />
    </svg>
  );
}
function McpIcon() {
  return (
    <svg {...svg({fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'})}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg {...svg({fill: 'currentColor'})}>
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.31L18.26 8 12 11.69 5.74 8 12 4.31ZM5 9.5l6 3.53v6.96l-6-3.33V9.5Zm14 0v7.16l-6 3.33V13.03l6-3.53Z" />
    </svg>
  );
}
function VsCodeIcon() {
  return (
    <svg {...svg({fill: 'currentColor'})}>
      <path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352Zm-5.146 14.861L10.826 12l7.178-5.448v10.896Z" />
    </svg>
  );
}
function CodexIcon() {
  return (
    <svg {...svg({fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'})}>
      <rect x="2.5" y="4" width="19" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13.5 15H17" />
    </svg>
  );
}

function Chevron({open}) {
  return (
    <svg {...svg({width: 14, height: 14, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'})}
      style={{transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease'}}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function CopyPageButton() {
  const {pathname} = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState('');
  const ref = useRef(null);
  const isBrowser = useIsBrowser();

  const mdPath = pathname.replace(/\/$/, '') + '.md';
  const mdUrl = siteConfig.url + mdPath;
  const aiPrompt = encodeURIComponent(
    `Read this Envio documentation page for full context, then help me put it into action, whether that's answering questions, writing code, or debugging. Here's the page: ${mdUrl}`,
  );

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Client-only: keep the button out of the SSR HTML so crawlers reach the
  // article content first (same pattern as the version banner).
  if (!isBrowser) {
    return null;
  }

  function flagError() {
    setCopied('error');
    setTimeout(() => setCopied(''), 2000);
  }

  async function copyText(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    } catch (e) {
      flagError();
    }
  }

  async function copyPage() {
    try {
      const res = await fetch(mdPath);
      if (!res.ok) throw new Error(`Could not fetch ${mdPath}: ${res.status}`);
      await copyText(await res.text(), 'page');
    } catch (e) {
      flagError();
    }
    setOpen(false);
  }

  const items = [
    {icon: <CopyIcon />, label: 'Copy page', desc: 'Copy as Markdown, ready to feed an LLM', onClick: copyPage},
    {icon: <MarkdownIcon />, label: 'View as Markdown', desc: 'Open the raw Markdown for this page', href: mdPath, external: true},
    {icon: <OpenAIIcon />, label: 'Open in ChatGPT', desc: 'Ask ChatGPT about this page', href: `https://chatgpt.com/?q=${aiPrompt}`, external: true},
    {icon: <ClaudeIcon />, label: 'Open in Claude', desc: 'Ask Claude about this page', href: `https://claude.ai/new?q=${aiPrompt}`, external: true},
    {icon: <PerplexityIcon />, label: 'Open in Perplexity', desc: 'Ask Perplexity about this page', href: `https://www.perplexity.ai/search?q=${aiPrompt}`, external: true},
    {icon: <McpIcon />, label: 'Copy MCP Server', desc: "Connect your AI to Envio's docs MCP", onClick: () => {copyText(MCP_URL, 'mcp'); setOpen(false);}, copiedKey: 'mcp'},
    {icon: <CursorIcon />, label: 'Connect to Cursor', desc: 'Install the Envio docs MCP in Cursor', href: CURSOR_DEEPLINK, external: true},
    {icon: <VsCodeIcon />, label: 'Connect to VS Code', desc: 'Install the Envio docs MCP in VS Code', href: VSCODE_DEEPLINK, external: true},
    {icon: <CodexIcon />, label: 'Connect to Codex', desc: 'Copy MCP config for Codex', onClick: () => {copyText(CODEX_CONFIG, 'codex'); setOpen(false);}, copiedKey: 'codex'},
  ];

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.split}>
        <button type="button" className={styles.mainBtn} onClick={copyPage}>
          {copied === 'page' ? <CheckIcon /> : <CopyIcon />}
          {copied === 'page' ? 'Copied!' : copied === 'error' ? 'Failed' : 'Copy page'}
        </button>
        <button
          type="button"
          className={styles.caretBtn}
          onClick={() => setOpen((o) => !o)}
          aria-label="More copy options"
          aria-expanded={open}>
          <Chevron open={open} />
        </button>
      </div>

      {open && (
        <div className={styles.menu} role="menu">
          {items.map((it, i) =>
            it.href ? (
              <a
                key={i}
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.item}
                onClick={() => setOpen(false)}>
                <span className={styles.itemIcon} aria-hidden>{it.icon}</span>
                <span className={styles.itemText}>
                  <span className={styles.itemLabel}>
                    {it.label}
                    {it.external && <span className={styles.ext} aria-hidden>↗</span>}
                  </span>
                  <span className={styles.itemDesc}>{it.desc}</span>
                </span>
              </a>
            ) : (
              <button key={i} type="button" className={styles.item} onClick={it.onClick}>
                <span className={styles.itemIcon} aria-hidden>{it.icon}</span>
                <span className={styles.itemText}>
                  <span className={styles.itemLabel}>
                    {copied === it.copiedKey ? 'Copied!' : it.label}
                  </span>
                  <span className={styles.itemDesc}>{it.desc}</span>
                </span>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
