import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

function BottomChatInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const inputRef = useRef(null);
  const observerRef = useRef(null);
  const messagesEndRef = useRef(null);
  
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

  const COOKBOOK_PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmY0NjNmNmJkODc1Y2E3NmUwMjAzMTciLCJpYXQiOjE3MjcyOTI0MDYsImV4cCI6MjA0Mjg2ODQwNn0.ruDwarOVwJ68IihIdMcqeKM7C0E_JaV-f0JIgqNwsdo";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const userQuestion = question.trim();
    
    // Add the question as a user message
    setMessages(prev => [...prev, { type: 'user', text: userQuestion }]);
    
    // Clear the input
    setQuestion('');
    
    // Open the sidebar
    setIsOpen(true);
    
    // Scroll to bottom of messages
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!isDocPage) {
    return null;
  }

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
                      <div className={styles.messageText}>{message.text}</div>
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

