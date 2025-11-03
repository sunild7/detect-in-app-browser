/**
 * Main Entry Point
 * Initializes the application and sets up global functions
 */

import { AppController } from './AppController.js';
import { InAppBrowserDetector } from './InAppBrowserDetector.js';

// Initialize the application
let appController;

document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('Initializing AppController...');
    appController = new AppController();
    console.log('AppController initialized:', appController);

    // Global functions
    window.getCurrentPageUrl = () => InAppBrowserDetector.getCurrentPageUrl();
    
    // Copy User Agent to clipboard (robust with multiple fallbacks)
    window.copyUserAgent = () => {
      // Prefer the exact UA we display, otherwise use navigator.userAgent
      const uaSpan = document.getElementById('user-agent');
      const userAgent = (uaSpan && uaSpan.textContent) ? uaSpan.textContent : navigator.userAgent;
      const copyBtn = document.getElementById('copy-ua-btn');

      // Attempt 1: Async Clipboard API (requires secure context/user gesture)
      const tryClipboardApi = () =>
        navigator.clipboard.writeText(userAgent)
          .then(() => showCopyFeedback(copyBtn))
          .catch((err) => {
            console.warn('Clipboard API failed, falling back:', err);
            tryExecCommand();
          });

      // Attempt 2: execCommand('copy') fallback
      const tryExecCommand = () => {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = userAgent;
          textArea.setAttribute('readonly', '');
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          textArea.setSelectionRange(0, userAgent.length);
          const ok = document.execCommand('copy');
          document.body.removeChild(textArea);
          if (ok) {
            showCopyFeedback(copyBtn);
          } else {
            tryPrompt();
          }
        } catch (e) {
          console.warn('execCommand fallback failed, falling back to prompt:', e);
          tryPrompt();
        }
      };

      // Attempt 3: prompt as last resort (lets user copy manually)
      const tryPrompt = () => {
        // Some environments (iOS older) only allow manual copy reliably
        window.prompt('Copy User Agent:', userAgent);
        showCopyFeedback(copyBtn, true);
      };

      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        tryClipboardApi();
      } else {
        tryExecCommand();
      }
    };
    
    // Fallback copy method
    function fallbackCopyUserAgent(text, btn) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          showCopyFeedback(btn);
        } else {
          alert('Could not copy User Agent. Please copy manually:\n' + text);
        }
      } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Could not copy User Agent. Please copy manually:\n' + text);
      }
    }
    
    // Show visual feedback when copied
    function showCopyFeedback(btn, isManual) {
      if (!btn) return;
      
      const originalText = btn.textContent;
      btn.textContent = isManual ? 'Shown to Copy' : 'Copied!';
      btn.style.background = '#28a745';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '#667eea';
      }, 2000);
    }
    // Also wire up button via addEventListener to avoid inline issues
    const uaBtn = document.getElementById('copy-ua-btn');
    if (uaBtn && !uaBtn._copyBound) {
      uaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.copyUserAgent();
      }, { passive: true });
      uaBtn._copyBound = true;
    }

    // Expose appController globally for inline onclick handlers
    window.appController = appController;
  } catch (error) {
    console.error('Error initializing app:', error);
    const statusElement = document.getElementById('detection-status');
    if (statusElement) {
      statusElement.textContent = `Initialization Error: ${error.message}`;
    }
  }
});
