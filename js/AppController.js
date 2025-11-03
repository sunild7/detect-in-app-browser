/**
 * Main Application Controller
 * Orchestrates the detection and UI updates
 */

import { InAppBrowserDetector } from './InAppBrowserDetector.js';

export class AppController {
  constructor() {
    this.isInApp = false;
    this.browserName = 'Unknown';
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.detectBrowser();
    this.setupEventListeners();
  }

  /**
   * Detect browser type and update state
   */
  detectBrowser() {
    try {
      // Immediate detection
      this.isInApp = InAppBrowserDetector.detectInAppBrowser();
      this.browserName = InAppBrowserDetector.getBrowserName();

      console.log('Browser Detection:', {
        isInApp: this.isInApp,
        browserName: this.browserName
      });

      // Update UI based on detection
      this.updateDetectionUI();
    } catch (error) {
      console.error('Error detecting browser:', error);
      this.browserName = 'Error';
      this.updateDetectionUI();
    }
  }

  /**
   * Update detection UI based on current state
   */
  updateDetectionUI() {
    const statusElement = document.getElementById('detection-status');
    if (!statusElement) {
      console.warn('detection-status element not found');
      // Try again after a short delay
      setTimeout(() => this.updateDetectionUI(), 100);
      return;
    }

    try {
      if (this.isInApp) {
        statusElement.innerHTML = `<span style="color: #ff6b6b; font-weight: bold;">🔒 In-App Browser Detected (${this.browserName})</span>`;
        this.showInAppUI();
      } else {
        statusElement.innerHTML = `<span style="color: #28a745; font-weight: bold;">🌐 Regular Browser (${this.browserName})</span>`;
        this.hideInAppUI();
      }
    } catch (error) {
      console.error('Error updating detection UI:', error);
      statusElement.textContent = `Error: ${error.message}`;
    }
  }

  /**
   * Show in-app browser UI elements
   */
  showInAppUI() {
    // Show warning banner
    this.createWarningBanner();
  }

  /**
   * Hide in-app browser UI elements
   */
  hideInAppUI() {
    // Remove any existing in-app UI elements
    const existingBanner = document.querySelector('.in-app-warning');

    if (existingBanner) existingBanner.remove();
  }

  /**
   * Create warning banner for in-app browser
   */
  createWarningBanner() {
    if (document.querySelector('.in-app-warning')) return;

    const banner = document.createElement('div');
    banner.className = 'in-app-warning';
    banner.innerHTML = `
                    ⚠️ You're viewing this in ${this.browserName}'s in-app browser.
                    <button onclick="this.parentElement.remove()">Dismiss</button>
                `;
    document.body.appendChild(banner);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Event listeners can be added here if needed in the future
  }
}
