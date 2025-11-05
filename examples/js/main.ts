/**
 * Main Entry Point
 * Initializes the application and sets up global functions
 * 
 * This file demonstrates how to integrate the detect-in-app-browser package
 * into a web application.
 */

import { AppController } from './AppController.js';
import { InAppBrowserDetector } from '../../dist/index.js';
import { copyToClipboard } from './utils/clipboard.js';

// Initialize the application
let appController: AppController | null = null;

// Extend Window interface for global functions
declare global {
  interface Window {
    appController: AppController | null;
    getCurrentPageUrl: () => string;
    copyUserAgent: () => Promise<void>;
  }
}

/**
 * Initialize the application when DOM is ready
 */
function initializeApp(): void {
  try {
    console.log('🚀 Initializing In-App Browser Detection Demo...');
    
    // Create and initialize the app controller
    appController = new AppController();
    console.log('✅ AppController initialized:', appController);

    // Setup global utility functions
    setupGlobalFunctions();

    // Expose appController globally for debugging and inline handlers
    window.appController = appController;

    console.log('✅ Application initialization complete');
  } catch (error) {
    console.error('❌ Error initializing app:', error);
    handleInitializationError(error);
  }
}

/**
 * Setup global utility functions
 */
function setupGlobalFunctions(): void {
  // Expose getCurrentPageUrl globally
  window.getCurrentPageUrl = (): string => {
    return InAppBrowserDetector.getCurrentPageUrl();
  };

  // Setup copy user agent function
  window.copyUserAgent = async (): Promise<void> => {
    const uaSpan = document.getElementById('user-agent');
    const userAgent = uaSpan?.textContent || navigator.userAgent;
    const copyBtn = document.getElementById('copy-ua-btn');

    try {
      await copyToClipboard(userAgent, copyBtn);
    } catch (error) {
      console.error('Failed to copy user agent:', error);
    }
  };

  // Wire up copy button event listener
  setupCopyButton();
}

/**
 * Setup copy button event listener
 */
function setupCopyButton(): void {
  const copyBtn = document.getElementById('copy-ua-btn');
  if (!copyBtn) {
    console.warn('Copy button not found');
    return;
  }

  // Check if already bound
  if ((copyBtn as any)._copyBound) {
    return;
  }

  copyBtn.addEventListener(
    'click',
    async (e) => {
      e.preventDefault();
      await window.copyUserAgent();
    },
    { passive: true }
  );

  // Mark as bound
  (copyBtn as any)._copyBound = true;
}

/**
 * Handle initialization errors
 */
function handleInitializationError(error: unknown): void {
  const statusElement = document.getElementById('detection-status');
  if (!statusElement) {
    console.error('Status element not found, cannot display error');
    return;
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  statusElement.innerHTML = `
    <span style="color: #ff6b6b; font-weight: bold;">
      ❌ Initialization Error: ${errorMessage}
    </span>
  `;
}

/**
 * Setup error handling for module loading failures
 */
function setupErrorHandling(): void {
  // Handle module loading errors
  window.addEventListener('error', (e) => {
    if (e.filename && e.filename.includes('main.js')) {
      const statusElement = document.getElementById('detection-status');
      if (statusElement && statusElement.textContent === 'Detecting...') {
        statusElement.innerHTML = `
          <span style="color: #ff6b6b;">
            ❌ Module loading failed. Check console for errors.
          </span>
        `;
      }
    }
  });

  // Fallback detection after delay
  setTimeout(() => {
    const statusElement = document.getElementById('detection-status');
    if (statusElement && statusElement.textContent === 'Detecting...') {
      console.warn('⚠️ Detection still showing "Detecting..." - module may not have loaded');
      
      if (window.appController) {
        console.log('🔄 Retrying detection...');
        window.appController.detectBrowser();
      } else {
        console.error('❌ AppController not found');
        if (statusElement) {
          statusElement.innerHTML = `
            <span style="color: #ff6b6b;">
              ❌ AppController not initialized. Please check the console.
            </span>
          `;
        }
      }
    }
  }, 1000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupErrorHandling();
    initializeApp();
  });
} else {
  // DOM is already loaded
  setupErrorHandling();
  initializeApp();
}
