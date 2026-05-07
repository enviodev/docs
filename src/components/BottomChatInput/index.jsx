import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './styles.module.css';

const DOCS_HOST = 'docs.envio.dev';

function isInternalDocsHref(href) {
  if (!href || typeof href !== 'string') return false;
  if (href.startsWith('/')) return true;
  if (href.startsWith('#')) return true;
  try {
    const u = new URL(href);
    if (typeof window !== 'undefined' && u.hostname === window.location.hostname) return true;
    return u.hostname === DOCS_HOST;
  } catch {
    return false;
  }
}

function toInternalPath(href) {
  if (href.startsWith('/') || href.startsWith('#')) return href;
  try {
    const u = new URL(href);
    return u.pathname + u.search + u.hash;
  } catch {
    return href;
  }
}

const markdownComponents = {
  a: ({ node, href, children, ...props }) => {
    if (isInternalDocsHref(href)) {
      return (
        <Link to={toInternalPath(href)} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
};

function BottomChatInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(500);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isResizingRef = useRef(false);

  // Load persisted sidebar width on mount (client-only)
  useEffect(() => {
    try {
      const saved = parseInt(localStorage.getItem('envio-chat-sidebar-width'), 10);
      if (Number.isFinite(saved) && saved >= 320) {
        setSidebarWidth(Math.min(saved, Math.floor(window.innerWidth * 0.9)));
      }
    } catch {
      // ignore
    }
  }, []);

  // Drag-to-resize for sidebar
  useEffect(() => {
    const handleMove = (e) => {
      if (!isResizingRef.current) return;
      const newWidth = Math.max(
        320,
        Math.min(window.innerWidth - e.clientX, Math.floor(window.innerWidth * 0.9))
      );
      setSidebarWidth(newWidth);
    };
    const handleUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      try {
        localStorage.setItem('envio-chat-sidebar-width', String(sidebarWidth));
      } catch {
        // ignore
      }
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [sidebarWidth]);

  const handleResizeStart = (e) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };
  
  const location = useLocation();
  
  // Only show on doc pages
  const isDocPage = location.pathname.startsWith('/docs/');
  
  useEffect(() => {
    if (!isDocPage || !inputRef.current || isOpen) return;

    const checkVisibility = () => {
      if (!inputRef.current || isOpen) return;

      // Find the footer section - try multiple selectors to be sure we find it
      const footerSection = 
        document.querySelector('footer[class*="docFooter"]') ||
        document.querySelector('footer.theme-doc-footer') ||
        document.querySelector('[class*="docFooter"]');
      
      if (!footerSection) {
        // If footer not found, keep input visible
        setIsVisible(true);
        return;
      }

      const inputRect = inputRef.current.getBoundingClientRect();
      const footerRect = footerSection.getBoundingClientRect();
      
      // Hide input bar when footer's top reaches or goes above input bar's bottom
      // This means the input bar would be "in line" with the footer section
      // We check if footer top is at or above the input bottom
      const shouldHide = footerRect.top <= inputRect.bottom;
      
      setIsVisible(!shouldHide);
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      checkVisibility();
    });

    // Check on scroll and resize
    const handleScroll = () => requestAnimationFrame(checkVisibility);
    const handleResize = () => requestAnimationFrame(checkVisibility);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDocPage, location.pathname, isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // No history persistence: each question is independent. The visible thread
  // exists only for the current chat panel and is wiped when the page reloads.

  const COOKBOOK_PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmY0NjNmNmJkODc1Y2E3NmUwMjAzMTciLCJpYXQiOjE3MjcyOTI0MDYsImV4cCI6MjA0Mjg2ODQwNn0.ruDwarOVwJ68IihIdMcqeKM7C0E_JaV-f0JIgqNwsdo";

  const appendToAiMessage = (aiIndex, delta) => {
    setMessages(prev => {
      const next = [...prev];
      const target = next[aiIndex];
      if (target && target.type === 'ai') {
        next[aiIndex] = { ...target, text: target.text + delta };
      }
      return next;
    });
  };

  const setAiMessage = (aiIndex, text) => {
    setMessages(prev => {
      const next = [...prev];
      const target = next[aiIndex];
      if (target && target.type === 'ai') {
        next[aiIndex] = { ...target, text };
      }
      return next;
    });
  };

  const streamAnswer = async (userQuestion, aiIndex) => {
    let response;
    try {
      response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuestion }),
      });
    } catch {
      setAiMessage(aiIndex, "Sorry — I couldn't fetch an answer. Please try again.");
      return;
    }

    if (!response.ok || !response.body) {
      setAiMessage(aiIndex, "Sorry — I couldn't fetch an answer. Please try again.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let received = false;
    let errored = false;

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let sepIndex;
        while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
          const rawEvent = buffer.slice(0, sepIndex);
          buffer = buffer.slice(sepIndex + 2);

          for (const line of rawEvent.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6).trim();
            if (!payload) continue;
            if (payload === '[DONE]') {
              buffer = '';
              break;
            }
            try {
              const parsed = JSON.parse(payload);
              if (parsed.error) {
                errored = true;
                continue;
              }
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (typeof delta === 'string' && delta.length > 0) {
                received = true;
                appendToAiMessage(aiIndex, delta);
              }
            } catch {
              // ignore malformed event
            }
          }
        }
      }
    } catch {
      errored = true;
    }

    if (errored && !received) {
      setAiMessage(aiIndex, "Sorry — I couldn't fetch an answer. Please try again.");
    } else if (!received) {
      setAiMessage(aiIndex, "I couldn't find an answer in the documentation. Please try rephrasing your question.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isStreaming) return;
    if (!question.trim()) return;

    const userQuestion = question.trim();

    const aiIndex = messages.length + 1;
    setMessages(prev => [
      ...prev,
      { type: 'user', text: userQuestion },
      { type: 'ai', text: '' },
    ]);

    setQuestion('');
    setIsOpen(true);
    setIsStreaming(true);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      await streamAnswer(userQuestion, aiIndex);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNewChat = () => {
    if (isStreaming) return;
    setMessages([]);
    setQuestion('');
  };

  return (
    <>
      {/* Bottom Input Bar - hidden only when the sidebar is open */}
      {!isOpen && (
        <div
          ref={inputRef}
          className={`${styles.bottomInputContainer} ${!isVisible ? styles.hidden : ''}`}
        >
          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              type="text"
              placeholder="Ask a question about Envio..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.submitButton} disabled={isStreaming || !question.trim()}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Side Panel */}
      {isOpen && (
        <>
          <div className={styles.sidePanel} style={{ width: `${sidebarWidth}px` }}>
            <div
              className={styles.resizeHandle}
              onMouseDown={handleResizeStart}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize sidebar"
            />
            <div className={styles.panelHeader}>
              <h3>Ask Envio AI</h3>
              <div className={styles.panelHeaderActions}>
                {messages.length > 0 && (
                  <button
                    onClick={handleNewChat}
                    className={styles.newChatButton}
                    disabled={isStreaming}
                    title="Start a new chat"
                  >
                    New chat
                  </button>
                )}
                <button onClick={handleClose} className={styles.closeButton}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className={styles.panelContent}>
              {messages.length === 0 ? (
                <p className={styles.placeholderText}>
                  Ask a question about Envio and get an AI-powered answer based on our documentation.
                </p>
              ) : (
                <div className={styles.messagesContainer}>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`${styles.messageBubble} ${
                        message.type === 'user' ? styles.userMessage : styles.aiMessage
                      }`}
                    >
                      <div className={styles.messageText}>
                        {message.type === 'ai' ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {message.text}
                          </ReactMarkdown>
                        ) : (
                          message.text
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            {/* Input at bottom of side panel */}
            <div className={styles.panelInputContainer}>
              <form onSubmit={handleSubmit} className={styles.inputForm}>
                <input
                  type="text"
                  placeholder="Ask a question about Envio..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className={styles.input}
                  autoFocus
                />
                <button type="submit" className={styles.submitButton} disabled={isStreaming || !question.trim()}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default BottomChatInput;

