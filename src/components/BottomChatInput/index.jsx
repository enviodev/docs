import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

function BottomChatInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const inputRef = useRef(null);
  const observerRef = useRef(null);
  
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

  if (!isDocPage) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const userQuestion = question.trim();
    // Don't clear question - keep it in the sidebar input
    setIsOpen(true);
    
    // TODO: Connect to LLM API here
    // You can use the same API key from docsbot or integrate with your own LLM service
    // Example: const response = await fetch('YOUR_LLM_API_ENDPOINT', { ... });
    console.log('Question submitted:', userQuestion);
    
    // For now, just show placeholder - will connect to LLM later
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Bottom Input Bar - hide when side panel is open */}
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
            <button type="submit" className={styles.submitButton}>
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
          <div className={styles.overlay} onClick={handleClose} />
          <div className={styles.sidePanel}>
            <div className={styles.panelHeader}>
              <h3>Ask Envio AI</h3>
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
            <div className={styles.panelContent}>
              <p className={styles.placeholderText}>
                AI response will appear here. This will be connected to the LLM API soon.
              </p>
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
                <button type="submit" className={styles.submitButton}>
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

