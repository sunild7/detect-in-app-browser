/**
 * In-App Browser Detection Class
 * Detects if the current browser is an in-app browser (WebView) or a regular browser
 */

export class InAppBrowserDetector {
  /**
   * Main detection method
   * @returns {boolean} True if in-app browser is detected
   */
  static detectInAppBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isBraveFeature = !!(navigator.brave && typeof navigator.brave.isBrave === 'function');
    const referrer = (document && document.referrer ? document.referrer : '').toLowerCase();

    // Update display info
    this.updateDetectionInfo(navigator.userAgent);

    // First, check if it's a known regular browser (EXCLUDE these FIRST - not in-app browsers)
    // IMPORTANT: Check regular browsers BEFORE checking for WebView/in-app browsers
    // DuckDuckGo and Brave are regular browsers, not in-app browsers
    // BUT: Don't check Chrome yet - we need to check for WebView first
    // Safari detection (exclude Chrome/Chromium tokens and iOS Chrome token CriOS)
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent) && !/crios/.test(userAgent) && !/wv/.test(userAgent) && !/gsa\//i.test(userAgent);
    const isEdge = /edg/.test(userAgent);
    const isFirefox = userAgent.includes('firefox');
    const isOpera = userAgent.includes('opera') || userAgent.includes('opr/');
    const isDuckDuckGo = userAgent.includes('duckduckgo') || userAgent.includes('ddg/');
    const isBrave = userAgent.includes('brave');
    const isVivaldi = userAgent.includes('vivaldi');
    
    // If it's a known regular browser (non-Chrome), return false immediately (not in-app browser)
    // This check must come FIRST before any WebView/in-app browser checks
    if (isSafari || isEdge || isFirefox || isOpera || isDuckDuckGo || isBrave || isVivaldi || isBraveFeature) {
      // Additional check for desktop browsers
      if (!isMobile && (isFirefox || isEdge || isOpera || isBrave || isVivaldi)) {
        return false;
      }
      // Mobile Safari, Edge, Firefox, DuckDuckGo, Brave are regular browsers, not in-app
      return false;
    }
    
    // IMPORTANT: For Chrome, check for explicit in-app indicators FIRST
    // Reference: Gmail has "GSA/" or "; wv" in UA, real Chrome doesn't
    // Check for explicit indicators BEFORE heuristic checks
    
    // Check for explicit in-app browser indicators in user agent or referrer
    // Google Search App (GSA) - has "GSA/" in user agent (reference pattern)
    const isGoogleApp = /gsa\//i.test(userAgent);
    // Android app referrer (Custom Tabs) e.g., android-app://com.google.android.gm
    const isAndroidAppReferrer = /^android-app:\/\//.test(referrer);
    const isGmailReferrer = /android-app:\/\/com\.google\.android\.gm|mail\.google\.com/.test(referrer);
    
    // Check for explicit WebView token (reference: "; wv" pattern)
    const hasExplicitWvToken = /\bwv\b/i.test(userAgent);
    
    // Check Chrome AFTER checking for explicit indicators
    // If it's Chrome with explicit WebView token or GSA, it's in-app
    if (userAgent.includes('chrome') && (isGoogleApp || hasExplicitWvToken || isGmailReferrer)) {
      return true; // Explicit in-app indicator found
    }
    
    // For Chrome without explicit indicators, check heuristics (Android only)
    let isWebView = false;
    if (/android/.test(userAgent) && userAgent.includes('chrome')) {
      isWebView = this.detectWebView(userAgent);
    }

    // Heuristic for Chrome Custom Tabs (CCT) / in-app Chrome without UA tokens
    // Only use this if referrer check didn't catch it (shouldn't happen, but safety)
    // Avoid false positives: only consider when there's NO obvious browser UI AND referrer suggests in-app
    let isChromeCct = false;
    try {
      const isAndroidChrome = /android/.test(userAgent) && userAgent.includes('chrome');
      const hasAndroidAppReferrer = /^android-app:\/\//.test(referrer);
      const outerDiffW = window.outerWidth - window.innerWidth;
      const outerDiffH = window.outerHeight - window.innerHeight;
      const hasBrowserUI = outerDiffW > 30 || outerDiffH > 30;
      
      // Only treat as CCT if: Android Chrome, has android-app:// referrer, and no visible browser UI
      // Regular Chrome typically has empty referrer or different referrer
      if (isAndroidChrome && hasAndroidAppReferrer && !hasBrowserUI) {
        isChromeCct = true;
      }
    } catch (e) {
      isChromeCct = false;
    }
    
    // Check for Gmail App specifically (only on mobile)
    const isGmail = isMobile && this.detectGmailApp();
    
    // If it's Google App (GSA), Gmail (explicit), WebView, or strong CCT heuristic, it's an in-app browser
    if (isGoogleApp || isGmail || isWebView || isChromeCct) {
      return true; // Google App, Gmail, or WebView is an in-app browser
    }
    
    // Check Chrome AFTER checking for WebView
    // If it's Chrome but NOT a WebView, it's a regular browser
    const isChrome = userAgent.includes('chrome') && !hasExplicitWvToken;
    if (isChrome && !isWebView) {
      return false; // Regular Chrome is not an in-app browser
    }

    // Method 1: Check for known in-app browser user agents (only on mobile)
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

    // Method 2 & 3: WebView and Gmail already checked above, but check again if needed
    // Check for Gmail App specifically (only on mobile, exclude Safari)
    const isGmailApp = isMobile && this.detectGmailApp() && !isSafari;
    
    // Re-check WebView if not already determined (Android only)
    const isWebViewCheck = /android/.test(userAgent) && this.detectWebView(userAgent);

    // Method 4: Check for standalone mode (PWA - not in-app browser)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // Method 5: (Removed) Mobile viewport behavior was causing false positives in regular Chrome
    const hasMobileViewportBehavior = false;

    // Final decision logic
    if (isStandalone || isSafari) {
      return false; // It's a PWA or Safari, not in-app browser
    }

    // Only consider it an in-app browser on mobile with STRONG indicators
    // Tokens (known in-app), explicit/strong WebView, or explicit Gmail detection
    if (isMobile && (hasKnownInApp || isWebViewCheck || isGmailApp)) {
      return true;
    }

    return false;
  }

  /**
   * Detect Gmail App specifically
   * @returns {boolean}
   */
  static detectGmailApp() {
    const userAgent = navigator.userAgent.toLowerCase();
    const referrer = (document && document.referrer ? document.referrer : '').toLowerCase();
    
    // Only run on mobile devices
    if (!/android|iphone|ipad/i.test(navigator.userAgent)) {
      return false;
    }

    // First check: explicit Gmail indicators
    // Prefer strong signals: referrer from Gmail app or GSA token
    const hasGmailReferrer = /android-app:\/\/com\.google\.android\.gm/.test(referrer);
    const hasGsaToken = /gsa\//i.test(userAgent);
    const hasWvToken = /\bwv\b/i.test(userAgent);
    if (hasGmailReferrer || hasGsaToken) return true;

    // Exclude regular Safari browser - Safari on iOS has "safari" in user agent
    if (userAgent.includes('safari') && !userAgent.includes('wv')) {
      return false;
    }

    // Gmail on Android often uses Chrome WebView/Custom Tabs
    // Only run heuristics if we have at least a weak hint (WV token)
    try {
      // First check: If it's Android and Chrome, check for WebView indicators
      if (/android/.test(userAgent) && userAgent.includes('chrome')) {
        if (hasWvToken) {
          const isWebViewIndicator = this.detectWebView(userAgent);
          if (isWebViewIndicator) return true;
        }
      }
      
      // Without explicit hints, do not classify as Gmail to avoid false positives
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * Detect WebView indicators
   * @param {string} userAgent - Lowercase user agent string
   * @returns {boolean}
   */
  static detectWebView(userAgent) {
    // Exclude known regular browsers that might match WebView patterns
    if (userAgent.includes('duckduckgo') || userAgent.includes('ddg/')) return false;
    if (userAgent.includes('edg') || userAgent.includes('edge/')) return false;
    if (userAgent.includes('brave') || (navigator.brave && typeof navigator.brave.isBrave === 'function')) return false;
    if (userAgent.includes('firefox')) return false;
    if (userAgent.includes('opera') || userAgent.includes('opr/')) return false;
    if (userAgent.includes('vivaldi')) return false;
    
    // WebView detection methods
    if (window.ReactNativeWebView) return true; // RN WebView (both platforms)

    // Check for WebView token patterns (reference: "; wv" pattern indicates WebView)
    // Pattern: "; wv" or " wv" or "wv;" indicates WebView
    if (/\bwv\b/.test(userAgent)) return true;

    // Android WebView detection
    // Based on reference: Real Chrome always has "Chrome/" in UA
    // Gmail/WebView may have "Version/" before "Chrome/" or missing "Chrome/" entirely
    if (/android/.test(userAgent)) {
      // KEY PATTERN from reference: "Version/4.0" before "Chrome/" or missing "Chrome/" = WebView
      // Real Chrome always has "Chrome/" pattern
      const hasVersionPattern = /version\/[\d.]+/i.test(userAgent);
      const hasChromePattern = /chrome\/[\d.]+/i.test(userAgent);
      
      // If has Version/ but Chrome/ is missing or comes later, likely WebView
      // Exclude known regular browsers
      if (hasVersionPattern) {
        const versionIndex = userAgent.toLowerCase().indexOf('version/');
        const chromeIndex = userAgent.toLowerCase().indexOf('chrome/');
        
        // If Version/ comes before Chrome/ OR Chrome/ is missing, it's likely WebView
        if (!hasChromePattern || (chromeIndex > versionIndex)) {
          // Exclude known regular browsers
          if (!userAgent.includes('ddg/') && 
              !userAgent.includes('duckduckgo') && 
              !userAgent.includes('brave') &&
              !(navigator.brave && typeof navigator.brave.isBrave === 'function')) {
            return true; // Android WebView pattern detected (Version/ without or before Chrome/)
          }
        }
      }
      
      // Check for Chrome WebView (Gmail in-app browser uses Chrome WebView/Custom Tab)
      // Reference: "; wv" pattern indicates WebView
      if (userAgent.includes('chrome') && /android/.test(userAgent)) {
        // CRITICAL: Check for browser UI first - regular Chrome ALWAYS has browser UI
        // If browser UI detected, it's definitely regular Chrome - exclude immediately
        const outerDiffW = window.outerWidth - window.innerWidth;
        const outerDiffH = window.outerHeight - window.innerHeight;
        const hasBrowserUI = outerDiffW > 30 || outerDiffH > 30;
        const screenDiff = (typeof screen !== 'undefined' && screen.width) ? (screen.width - window.outerWidth) : 0;
        const hasNormalScreenLayout = screenDiff > 50;
        
        // If has browser UI or normal screen layout, it's regular Chrome
        if (hasBrowserUI || hasNormalScreenLayout) {
          return false; // Regular Chrome - has browser UI
        }
        
        // Check for explicit WebView token (reference: "; wv" pattern)
        const hasWvToken = /\bwv\b/.test(userAgent);
        
        // If explicit WebView token found, it's definitely WebView
        if (hasWvToken) {
          return true;
        }
        
        // Only use heuristics if no explicit token AND no browser UI detected
        // Be very conservative: do NOT rely on missing APIs alone (caused false positives in regular Chrome)
        try {
          // Check for standalone display mode (not in-app browser if standalone)
          const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
          if (isStandalone) {
            return false; // PWA, not in-app browser
          }
          
          // No explicit token: do not classify as WebView here to avoid false positives
          // Rely on explicit tokens (wv) or Version/ pattern handled above
          return false;
        } catch (e) {
          // If we can't check, default to not treating as WebView (conservative)
          return false;
        }
      }
    }

    // iOS: avoid classifying full Safari/Chrome as WebView via feature probes
    // Rely on explicit tokens (GSA, referrer) handled elsewhere
    return false;

    return false;
  }

  /**
   * Check viewport behavior typical of in-app browsers
   * @returns {boolean}
   */
  static checkViewportBehavior() {
    // Check for viewport behavior typical of in-app browsers
    const viewport = document.querySelector('meta[name="viewport"]');
    const hasRestrictiveViewport = viewport && viewport.content.includes('user-scalable=no');

    // Check if window size matches common in-app browser dimensions
    const isSmallViewport = window.innerWidth < 400 || window.innerHeight < 400;

    return hasRestrictiveViewport || isSmallViewport;
  }

  /**
   * Get the browser name
   * @returns {string}
   */
  static getBrowserName() {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check for in-app browsers FIRST (before regular browsers)
    // Google Search App (GSA) - has "GSA/" in user agent
    if (/gsa\//i.test(userAgent)) return 'Google App';
    
    // Check for other in-app browsers
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

    // Check for regular browsers (but exclude if they have in-app indicators like GSA)
    // Important: Detect Brave before Chrome, also feature-detect Brave
    if (userAgent.includes('edg') || userAgent.includes('edge/')) return 'Edge';
    if (userAgent.includes('duckduckgo') || userAgent.includes('ddg/')) return 'DuckDuckGo';
    if (userAgent.includes('brave') || (navigator.brave && typeof navigator.brave.isBrave === 'function')) return 'Brave';
    // iOS Chrome identifies with "CriOS" token
    if (userAgent.includes('crios')) return 'Chrome';
    if (userAgent.includes('chrome') && !userAgent.includes('wv')) return 'Chrome';
    if (userAgent.includes('firefox')) return 'Firefox';
    // Safari check: must have "safari" and NOT "chrome", "wv" (webview), or "GSA" (Google App)
    if (userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('crios') && !userAgent.includes('wv') && !/gsa\//i.test(userAgent)) return 'Safari';
    if (userAgent.includes('opera') || userAgent.includes('opr/')) return 'Opera';
    if (userAgent.includes('vivaldi')) return 'Vivaldi';

    // Only check for WebView if no regular browser was found
    if (this.detectWebView(userAgent)) return 'WebView';

    return 'Unknown Browser';
  }

  /**
   * Get the current page URL
   * @returns {string}
   */
  static getCurrentPageUrl() {
    return window.location.href;
  }

  /**
   * Update detection info in the DOM
   * @param {string} userAgent - User agent string
   */
  static updateDetectionInfo(userAgent) {
    const userAgentElement = document.getElementById('user-agent');
    if (userAgentElement) {
      userAgentElement.textContent = userAgent;
    }

    // Diagnostics for debugging regular Chrome vs in-app browsers
    try {
      const owEl = document.getElementById('ow');
      const iwEl = document.getElementById('iw');
      const ohEl = document.getElementById('oh');
      const ihEl = document.getElementById('ih');
      const shareEl = document.getElementById('share-exists');
      const standaloneEl = document.getElementById('standalone');
      const refEl = document.getElementById('doc-referrer');

      if (owEl) owEl.textContent = String(window.outerWidth);
      if (iwEl) iwEl.textContent = String(window.innerWidth);
      if (ohEl) ohEl.textContent = String(window.outerHeight);
      if (ihEl) ihEl.textContent = String(window.innerHeight);
      if (shareEl) shareEl.textContent = typeof navigator !== 'undefined' && typeof navigator.share !== 'undefined' ? 'true' : 'false';
      if (standaloneEl) {
        let standalone = false;
        try {
          standalone = !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
        } catch (e) {
          standalone = false;
        }
        standaloneEl.textContent = standalone ? 'true' : 'false';
      }
      if (refEl) refEl.textContent = document.referrer || '';
    } catch (e) {
      // Ignore diagnostics errors
    }
  }
}
