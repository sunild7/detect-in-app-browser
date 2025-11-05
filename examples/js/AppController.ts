/**
 * Main Application Controller
 * Orchestrates the detection and UI updates
 * 
 * This example demonstrates how to use the detect-in-app-browser package
 * in a real application scenario.
 */

import type { BrowserName } from '../../dist/index.js';
import { InAppBrowserDetector, PlatformUtils } from '../../dist/index.js';
import { createWarningBanner, removeWarningBanner, updateElementHTML, updateElementText } from './utils/ui.js';

/**
 * Application Controller
 * Manages browser detection state and UI updates
 */
export class AppController {
  private isInApp: boolean = false;
  private browserName: BrowserName = 'Unknown Browser';
  private os: string = 'Unknown';
  private osVersion: string = 'Unknown';
  private browserVersion: string = 'Unknown';

  constructor() {
    this.init();
  }

  /**
   * Initialize the application
   */
  private init(): void {
    this.detectBrowser();
    this.setupEventListeners();
  }

  /**
   * Detect browser type and update state
   */
  detectBrowser(): void {
    try {
      // Perform detection using the package
      this.isInApp = InAppBrowserDetector.detectInAppBrowser();
      this.browserName = InAppBrowserDetector.getBrowserName();

      // Get platform information
      this.os = PlatformUtils.getOS();
      this.osVersion = PlatformUtils.getOSVersion();
      this.browserVersion = PlatformUtils.getBrowserVersion();

      // Log detection results
      console.log('Browser Detection Results:', {
        isInApp: this.isInApp,
        browserName: this.browserName,
        os: this.os,
        osVersion: this.osVersion,
        browserVersion: this.browserVersion,
        isMobile: PlatformUtils.isMobile(),
        isAndroid: PlatformUtils.isAndroid(),
        isIOS: PlatformUtils.isIOS(),
      });

      // Update UI based on detection
      this.updateDetectionUI();
    } catch (error) {
      console.error('Error detecting browser:', error);
      this.handleDetectionError(error);
    }
  }

  /**
   * Handle detection errors
   */
  private handleDetectionError(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.browserName = 'Unknown Browser';
    updateElementHTML(
      'detection-status',
      `<span style="color: #ff6b6b; font-weight: bold;">❌ Detection Error: ${errorMessage}</span>`
    );
  }

  /**
   * Update detection UI based on current state
   */
  private updateDetectionUI(): void {
    const statusElement = document.getElementById('detection-status');
    if (!statusElement) {
      console.warn('detection-status element not found, retrying...');
      setTimeout(() => this.updateDetectionUI(), 100);
      return;
    }

    try {
      // Build device details string
      const deviceDetails: string[] = [];
      
      if (this.os !== 'Unknown') {
        const osInfo = this.osVersion !== 'Unknown' 
          ? `${this.os} ${this.osVersion}` 
          : this.os;
        deviceDetails.push(osInfo);
      }
      
      if (this.browserVersion !== 'Unknown') {
        deviceDetails.push(`${this.browserName} ${this.browserVersion}`);
      }

      const detailsString = deviceDetails.length > 0 
        ? ` - ${deviceDetails.join(', ')}` 
        : '';

      // Update status display
      if (this.isInApp) {
        statusElement.innerHTML = `
          <span style="color: #ff6b6b; font-weight: bold;">
            🔒 In-App Browser Detected (${this.browserName})${detailsString}
          </span>
        `;
        this.showInAppUI();
      } else {
        statusElement.innerHTML = `
          <span style="color: #28a745; font-weight: bold;">
            🌐 Regular Browser (${this.browserName})${detailsString}
          </span>
        `;
        this.hideInAppUI();
      }

      // Update additional info
      this.updateAdditionalInfo();
    } catch (error) {
      console.error('Error updating detection UI:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (statusElement) {
        statusElement.textContent = `Error: ${errorMessage}`;
      }
    }
  }

  /**
   * Update additional diagnostic information
   */
  private updateAdditionalInfo(): void {
    if (typeof window === 'undefined') return;

    try {
      updateElementText('ow', String(window.outerWidth));
      updateElementText('iw', String(window.innerWidth));
      updateElementText('oh', String(window.outerHeight));
      updateElementText('ih', String(window.innerHeight));

      const hasShare = typeof navigator !== 'undefined' && typeof navigator.share !== 'undefined';
      updateElementText('share-exists', hasShare ? 'true' : 'false');

      const isStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
      updateElementText('standalone', isStandalone ? 'true' : 'false');

      const referrer = document.referrer || '';
      updateElementText('doc-referrer', referrer);
    } catch (error) {
      console.warn('Error updating additional info:', error);
    }
  }

  /**
   * Show in-app browser UI elements
   */
  private showInAppUI(): void {
    createWarningBanner(this.browserName);
  }

  /**
   * Hide in-app browser UI elements
   */
  private hideInAppUI(): void {
    removeWarningBanner();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Add any additional event listeners here
    // Example: Listen for window resize to update UI
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.updateAdditionalInfo();
      });
    }
  }

  /**
   * Get current detection state
   */
  getState(): {
    isInApp: boolean;
    browserName: BrowserName;
    os: string;
    osVersion: string;
    browserVersion: string;
  } {
    return {
      isInApp: this.isInApp,
      browserName: this.browserName,
      os: this.os,
      osVersion: this.osVersion,
      browserVersion: this.browserVersion,
    };
  }
}
