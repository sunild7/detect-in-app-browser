/**
 * Browser Opener Utility
 * Provides functions to open URLs in system browsers (Chrome and Safari)
 * 
 * @version 1.0.0
 * @license MIT
 */

import { PlatformUtils } from './PlatformUtils.js';

export class BrowserOpener {
  /**
   * Open a URL in Chrome browser
   * 
   * @param {string} url - The URL to open (defaults to current page URL)
   * @returns {boolean} True if the attempt was made (may fail if Chrome is not installed)
   * 
   * @example
   * ```typescript
   * BrowserOpener.openInChrome();
   * // or
   * BrowserOpener.openInChrome('https://example.com');
   * ```
   */
  static openInChrome(url?: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const targetUrl = url || window.location.href;
    
    try {
      let chromeUrl: string;
      
      if (PlatformUtils.isAndroid()) {
        // Use Intent URL for Android
        // Format: intent://host#Intent;scheme=https;package=com.android.chrome;end
        try {
          const urlObj = new URL(targetUrl);
          const scheme = urlObj.protocol.replace(':', ''); // 'https' or 'http'
          const host = urlObj.host;
          const path = urlObj.pathname + urlObj.search + urlObj.hash;
          
          // Build Intent URL
          chromeUrl = `intent://${host}${path}#Intent;scheme=${scheme};package=com.android.chrome;end`;
        } catch (urlError) {
          // If URL parsing fails, try a simpler approach
          const isHttps = /^https:\/\//i.test(targetUrl);
          const scheme = isHttps ? 'https' : 'http';
          const urlWithoutProtocol = targetUrl.replace(/^https?:\/\//i, '');
          const host = urlWithoutProtocol.split('/')[0];
          const path = urlWithoutProtocol.substring(host.length);
          chromeUrl = `intent://${host}${path}#Intent;scheme=${scheme};package=com.android.chrome;end`;
        }
      } else {
        // Use custom URL scheme for iOS
        const isHttps = /^https:\/\//i.test(targetUrl);
        const protocol = isHttps ? 'googlechromes://' : 'googlechrome://';
        const urlWithoutProtocol = targetUrl.replace(/^https?:\/\//i, '');
        chromeUrl = `${protocol}${urlWithoutProtocol}`;
      }
      
      // Try to open in Chrome
      window.location.href = chromeUrl;
      
      // Fallback: if Chrome is not installed, try after a short delay
      setTimeout(() => {
        // If we're still on the same page, Chrome might not be installed
        // Try opening the URL directly (will open in default browser)
        if (window.location.href === chromeUrl || window.location.href === targetUrl) {
          window.open(targetUrl, '_blank');
        }
      }, 500);
      
      return true;
    } catch (e) {
      console.error('Failed to open in Chrome:', e);
      // Fallback to opening in new tab
      try {
        window.open(targetUrl, '_blank');
        return true;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return false;
      }
    }
  }

  /**
   * Open a URL in Safari browser
   * 
   * @param {string} url - The URL to open (defaults to current page URL)
   * @returns {boolean} True if the attempt was made (iOS only, may fail if Safari is not available)
   * 
   * @example
   * ```typescript
   * BrowserOpener.openInSafari();
   * // or
   * BrowserOpener.openInSafari('https://example.com');
   * ```
   */
  static openInSafari(url?: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    // Safari opening is only available on iOS
    if (!PlatformUtils.isIOS()) {
      console.warn('Safari opening is only available on iOS devices');
      // On non-iOS, just open in a new tab (will use default browser)
      const targetUrl = url || window.location.href;
      try {
        window.open(targetUrl, '_blank');
        return true;
      } catch (e) {
        console.error('Failed to open URL:', e);
        return false;
      }
    }

    const targetUrl = url || window.location.href;
    
    try {
      // Determine if URL is HTTPS or HTTP
      const isHttps = /^https:\/\//i.test(targetUrl);
      const protocol = isHttps ? 'x-safari-https://' : 'x-safari-http://';
      
      // Remove the protocol from the URL
      const urlWithoutProtocol = targetUrl.replace(/^https?:\/\//i, '');
      const safariUrl = `${protocol}${urlWithoutProtocol}`;
      
      // Try to open in Safari
      window.location.href = safariUrl;
      
      // Fallback: if Safari URL scheme doesn't work, try after a short delay
      setTimeout(() => {
        // If we're still on the same page, Safari scheme might not have worked
        // Try opening the URL directly
        if (window.location.href === safariUrl || window.location.href === targetUrl) {
          window.open(targetUrl, '_blank');
        }
      }, 500);
      
      return true;
    } catch (e) {
      console.error('Failed to open in Safari:', e);
      // Fallback to opening in new tab
      try {
        window.open(targetUrl, '_blank');
        return true;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return false;
      }
    }
  }

  /**
   * Check if Chrome is likely available on the device
   * 
   * @returns {boolean} True if Chrome might be available
   */
  static isChromeAvailable(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }
    
    // Chrome is available on both Android and iOS
    return PlatformUtils.isAndroid() || PlatformUtils.isIOS();
  }

  /**
   * Check if Safari is likely available on the device
   * 
   * @returns {boolean} True if Safari might be available (iOS only)
   */
  static isSafariAvailable(): boolean {
    return PlatformUtils.isIOS();
  }
}

