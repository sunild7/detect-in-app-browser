/**
 * In-App Browser Detection Library
 * Detects if the current browser is an in-app browser (WebView) or a regular browser
 * 
 * @version 1.0.0
 * @license MIT
 */

export class InAppBrowserDetector {
  /**
   * Main detection method
   * Detects if the current browser is an in-app browser (WebView)
   * 
   * @returns {boolean} True if in-app browser is detected, false otherwise
   * 
   * @example
   * ```javascript
   * const isInApp = InAppBrowserDetector.detectInAppBrowser();
   * if (isInApp) {
   *   console.log('User is in an in-app browser');
   * }
   * ```
   */
  static detectInAppBrowser() {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
      return false;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isBraveFeature = !!(navigator.brave && typeof navigator.brave.isBrave === 'function');
    const referrer = (typeof document !== 'undefined' && document.referrer ? document.referrer : '').toLowerCase();

    // First, check if it's a known regular browser (EXCLUDE these FIRST - not in-app browsers)
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent) && !/crios/.test(userAgent) && !/wv/.test(userAgent) && !/gsa\//i.test(userAgent);
    const isEdge = /edg/.test(userAgent);
    const isFirefox = userAgent.includes('firefox');
    const isOpera = userAgent.includes('opera') || userAgent.includes('opr/');
    const isDuckDuckGo = userAgent.includes('duckduckgo') || userAgent.includes('ddg/');
    const isBrave = userAgent.includes('brave');
    const isVivaldi = userAgent.includes('vivaldi');
    
    // If it's a known regular browser (non-Chrome), return false immediately
    if (isSafari || isEdge || isFirefox || isOpera || isDuckDuckGo || isBrave || isVivaldi || isBraveFeature) {
      if (!isMobile && (isFirefox || isEdge || isOpera || isBrave || isVivaldi)) {
        return false;
      }
      return false;
    }
    
    // Check for explicit in-app browser indicators
    const isGoogleApp = /gsa\//i.test(userAgent);
    const isAndroidAppReferrer = /^android-app:\/\//.test(referrer);
    const isGmailReferrer = /android-app:\/\/com\.google\.android\.gm|mail\.google\.com/.test(referrer);
    const hasExplicitWvToken = /\bwv\b/i.test(userAgent);
    
    // Check Chrome AFTER checking for explicit indicators
    if (userAgent.includes('chrome') && (isGoogleApp || hasExplicitWvToken || isGmailReferrer)) {
      return true;
    }
    
    // For Chrome without explicit indicators, check heuristics (Android only)
    let isWebView = false;
    if (/android/.test(userAgent) && userAgent.includes('chrome')) {
      isWebView = this.detectWebView(userAgent);
    }

    // Heuristic for Chrome Custom Tabs (CCT)
    let isChromeCct = false;
    try {
      const isAndroidChrome = /android/.test(userAgent) && userAgent.includes('chrome');
      const hasAndroidAppReferrer = /^android-app:\/\//.test(referrer);
      const outerDiffW = window.outerWidth - window.innerWidth;
      const outerDiffH = window.outerHeight - window.innerHeight;
      const hasBrowserUI = outerDiffW > 30 || outerDiffH > 30;
      
      if (isAndroidChrome && hasAndroidAppReferrer && !hasBrowserUI) {
        isChromeCct = true;
      }
    } catch (e) {
      isChromeCct = false;
    }
    
    // Check for Gmail App specifically (only on mobile)
    const isGmail = isMobile && this.detectGmailApp();
    
    // If it's Google App, Gmail, WebView, or strong CCT heuristic, it's an in-app browser
    if (isGoogleApp || isGmail || isWebView || isChromeCct) {
      return true;
    }
    
    // Check Chrome AFTER checking for WebView
    const isChrome = userAgent.includes('chrome') && !hasExplicitWvToken;
    if (isChrome && !isWebView) {
      return false;
    }

    // Check for known in-app browser user agents (only on mobile)
    const knownInAppBrowsers = [
      'fban', 'fbav', // Facebook
      'twitter', // Twitter
      'linkedinapp', // LinkedIn
      'instagram', // Instagram
      'line', // Line
      'whatsapp', // WhatsApp
      'snapchat', // Snapchat
      'pinterest', // Pinterest
      'slack', // Slack
      'discord', // Discord
      'telegram', // Telegram
      'viber', // Viber
      'wechat', // WeChat
      'qq', // QQ
      'gsa/', // Google Search App
    ];

    const hasKnownInApp = isMobile && knownInAppBrowsers.some(browser => userAgent.includes(browser));
    const isGmailApp = isMobile && this.detectGmailApp() && !isSafari;
    const isWebViewCheck = /android/.test(userAgent) && this.detectWebView(userAgent);

    // Check for standalone mode (PWA - not in-app browser)
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;

    // Final decision logic
    if (isStandalone || isSafari) {
      return false;
    }

    // Only consider it an in-app browser on mobile with STRONG indicators
    if (isMobile && (hasKnownInApp || isWebViewCheck || isGmailApp)) {
      return true;
    }

    return false;
  }

  /**
   * Detect Gmail App specifically
   * 
   * @returns {boolean} True if Gmail app browser is detected
   */
  static detectGmailApp() {
    if (typeof document === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const referrer = (document.referrer ? document.referrer : '').toLowerCase();
    
    // Only run on mobile devices
    if (!/android|iphone|ipad/i.test(navigator.userAgent)) {
      return false;
    }

    // First check: explicit Gmail indicators
    const hasGmailReferrer = /android-app:\/\/com\.google\.android\.gm/.test(referrer);
    const hasGsaToken = /gsa\//i.test(userAgent);
    const hasWvToken = /\bwv\b/i.test(userAgent);
    
    if (hasGmailReferrer || hasGsaToken) {
      return true;
    }

    // Exclude regular Safari browser
    if (userAgent.includes('safari') && !hasWvToken) {
      return false;
    }

    // Gmail on Android often uses Chrome WebView/Custom Tabs
    try {
      if (/android/.test(userAgent) && userAgent.includes('chrome')) {
        if (hasWvToken) {
          const isWebViewIndicator = this.detectWebView(userAgent);
          if (isWebViewIndicator) {
            return true;
          }
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * Detect WebView indicators from a user agent string
   * 
   * @param {string} userAgent - Lowercase user agent string
   * @returns {boolean} True if WebView is detected
   */
  static detectWebView(userAgent) {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    // Exclude known regular browsers
    if (userAgent.includes('duckduckgo') || userAgent.includes('ddg/')) return false;
    if (userAgent.includes('edg') || userAgent.includes('edge/')) return false;
    if (userAgent.includes('brave') || (navigator.brave && typeof navigator.brave.isBrave === 'function')) return false;
    if (userAgent.includes('firefox')) return false;
    if (userAgent.includes('opera') || userAgent.includes('opr/')) return false;
    if (userAgent.includes('vivaldi')) return false;
    
    // WebView detection methods
    if (window.ReactNativeWebView) return true;

    // Check for WebView token patterns
    if (/\bwv\b/.test(userAgent)) return true;

    // Android WebView detection
    if (/android/.test(userAgent)) {
      const hasVersionPattern = /version\/[\d.]+/i.test(userAgent);
      const hasChromePattern = /chrome\/[\d.]+/i.test(userAgent);
      
      if (hasVersionPattern) {
        const versionIndex = userAgent.toLowerCase().indexOf('version/');
        const chromeIndex = userAgent.toLowerCase().indexOf('chrome/');
        
        // If Version/ comes before Chrome/ OR Chrome/ is missing, it's likely WebView
        if (!hasChromePattern || (chromeIndex > versionIndex)) {
          if (!userAgent.includes('ddg/') && 
              !userAgent.includes('duckduckgo') && 
              !userAgent.includes('brave') &&
              !(navigator.brave && typeof navigator.brave.isBrave === 'function')) {
            return true;
          }
        }
      }
      
      // Check for Chrome WebView
      if (userAgent.includes('chrome')) {
        const outerDiffW = window.outerWidth - window.innerWidth;
        const outerDiffH = window.outerHeight - window.innerHeight;
        const hasBrowserUI = outerDiffW > 30 || outerDiffH > 30;
        const screenDiff = (typeof screen !== 'undefined' && screen.width) ? (screen.width - window.outerWidth) : 0;
        const hasNormalScreenLayout = screenDiff > 50;
        
        if (hasBrowserUI || hasNormalScreenLayout) {
          return false;
        }
        
        const hasWvToken = /\bwv\b/.test(userAgent);
        if (hasWvToken) {
          return true;
        }
        
        try {
          const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
          if (isStandalone) {
            return false;
          }
          return false;
        } catch (e) {
          return false;
        }
      }
    }

    return false;
  }

  /**
   * Get the browser name
   * 
   * @returns {string} Browser name (e.g., 'Chrome', 'Safari', 'Facebook', 'Gmail', etc.)
   * 
   * @example
   * ```javascript
   * const browserName = InAppBrowserDetector.getBrowserName();
   * console.log('Browser:', browserName);
   * ```
   */
  static getBrowserName() {
    if (typeof navigator === 'undefined') {
      return 'Unknown Browser';
    }

    const userAgent = navigator.userAgent.toLowerCase();

    // Check for in-app browsers FIRST
    if (/gsa\//i.test(userAgent)) return 'Google App';
    if (userAgent.includes('fban') || userAgent.includes('fbav')) return 'Facebook';
    if (userAgent.includes('twitter')) return 'Twitter';
    if (userAgent.includes('instagram')) return 'Instagram';
    if (userAgent.includes('linkedinapp')) return 'LinkedIn';
    if (userAgent.includes('snapchat')) return 'Snapchat';
    if (userAgent.includes('whatsapp')) return 'WhatsApp';
    if (userAgent.includes('line')) return 'Line';
    if (userAgent.includes('discord')) return 'Discord';
    if (userAgent.includes('telegram')) return 'Telegram';
    if (this.detectGmailApp()) return 'Gmail';

    // Check for regular browsers
    if (userAgent.includes('edg') || userAgent.includes('edge/')) return 'Edge';
    if (userAgent.includes('duckduckgo') || userAgent.includes('ddg/')) return 'DuckDuckGo';
    if (userAgent.includes('brave') || (navigator.brave && typeof navigator.brave.isBrave === 'function')) return 'Brave';
    if (userAgent.includes('crios')) return 'Chrome';
    if (userAgent.includes('chrome') && !userAgent.includes('wv')) return 'Chrome';
    if (userAgent.includes('firefox')) return 'Firefox';
    if (userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('crios') && !userAgent.includes('wv') && !/gsa\//i.test(userAgent)) return 'Safari';
    if (userAgent.includes('opera') || userAgent.includes('opr/')) return 'Opera';
    if (userAgent.includes('vivaldi')) return 'Vivaldi';

    // Only check for WebView if no regular browser was found
    if (this.detectWebView(userAgent)) return 'WebView';

    return 'Unknown Browser';
  }

  /**
   * Get the current page URL
   * 
   * @returns {string} Current page URL
   */
  static getCurrentPageUrl() {
    if (typeof window === 'undefined') {
      return '';
    }
    try {
      return window.location.href;
    } catch (e) {
      return '';
    }
  }
}

