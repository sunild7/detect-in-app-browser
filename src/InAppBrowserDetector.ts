/**
 * In-App Browser Detection Class
 * Detects if the current browser is an in-app browser (WebView) or a regular browser
 */

import type { BrowserName, ReactNativeWebViewWindow } from './types.js';
import {
  KNOWN_IN_APP_BROWSERS,
  REGEX_PATTERNS,
  BROWSER_UI_THRESHOLDS,
  BROWSER_NAME_MAP,
} from './constants.js';
import {
  isNavigatorAvailable,
  isWindowAvailable,
  isDocumentAvailable,
  getUserAgent,
  getReferrer,
  isMobileDevice,
  isAndroidDevice,
  isIOSDevice,
  hasBraveFeature,
  hasWebViewToken,
  hasGoogleAppToken,
  isAndroidAppReferrer,
  isGmailReferrer,
  hasBrowserUI,
  hasNormalScreenLayout,
  isStandaloneMode,
  isKnownRegularBrowser,
} from './utils/browserDetection.js';

/**
 * In-App Browser Detector
 * 
 * Provides static methods to detect in-app browsers (WebView) and differentiate
 * them from regular browsers. Supports detection of Facebook, Twitter, Instagram,
 * Gmail, and other in-app browsers.
 * 
 * @example
 * ```typescript
 * const isInApp = InAppBrowserDetector.detectInAppBrowser();
 * const browserName = InAppBrowserDetector.getBrowserName();
 * ```
 */
export class InAppBrowserDetector {
  /**
   * Main detection method
   * Detects if the current browser is an in-app browser (WebView)
   * 
   * @returns {boolean} True if in-app browser is detected, false otherwise
   */
  static detectInAppBrowser(): boolean {
    if (!isWindowAvailable() || !isNavigatorAvailable()) {
      return false;
    }

    const userAgent = getUserAgent();
    const referrer = getReferrer();
    const isMobile = isMobileDevice(userAgent);

    // Update display info
    this.updateDetectionInfo(navigator.userAgent);

    // First, check if it's a known regular browser (EXCLUDE these FIRST - not in-app browsers)
    const regularBrowser = isKnownRegularBrowser(userAgent);
    
    if (regularBrowser.isRegular) {
      // Desktop browsers are definitely not in-app
      if (!isMobile && (regularBrowser.isFirefox || regularBrowser.isEdge || regularBrowser.isOpera || regularBrowser.isBrave || regularBrowser.isVivaldi)) {
        return false;
      }
      // Mobile regular browsers are also not in-app
      return false;
    }

    // Check for explicit in-app browser indicators
    const isGoogleApp = hasGoogleAppToken(userAgent);
    const isAndroidAppRef = isAndroidAppReferrer(referrer);
    const isGmailRef = isGmailReferrer(referrer);
    const hasExplicitWvToken = hasWebViewToken(userAgent);

    // Check Chrome AFTER checking for explicit indicators
    if (REGEX_PATTERNS.CHROME.test(userAgent) && (isGoogleApp || hasExplicitWvToken || isGmailRef)) {
      return true;
    }

    // For Chrome without explicit indicators, check heuristics (Android only)
    let isWebView = false;
    if (isAndroidDevice(userAgent) && REGEX_PATTERNS.CHROME.test(userAgent)) {
      isWebView = this.detectWebView(userAgent);
    }

    // Heuristic for Chrome Custom Tabs (CCT)
    let isChromeCct = false;
    try {
      const isAndroidChrome = isAndroidDevice(userAgent) && REGEX_PATTERNS.CHROME.test(userAgent);
      const hasAndroidAppRef = isAndroidAppReferrer(referrer);

      if (isAndroidChrome && hasAndroidAppRef && !hasBrowserUI()) {
        isChromeCct = true;
      }
    } catch {
      isChromeCct = false;
    }

    // Check for Gmail App specifically (only on mobile)
    const isGmail = isMobile && this.detectGmailApp();

    // If it's Google App (GSA), Gmail (explicit), WebView, or strong CCT heuristic, it's an in-app browser
    if (isGoogleApp || isGmail || isWebView || isChromeCct) {
      return true;
    }

    // Check Chrome AFTER checking for WebView
    const isChrome = REGEX_PATTERNS.CHROME.test(userAgent) && !hasExplicitWvToken;
    if (isChrome && !isWebView) {
      return false;
    }

    // Check for known in-app browser user agents (only on mobile)
    const hasKnownInApp = isMobile && KNOWN_IN_APP_BROWSERS.some((browser) =>
      userAgent.includes(browser)
    );

    const isGmailApp = isMobile && this.detectGmailApp() && !regularBrowser.isSafari;
    const isWebViewCheck = isAndroidDevice(userAgent) && this.detectWebView(userAgent);

    // Final decision logic
    if (isStandaloneMode() || regularBrowser.isSafari) {
      return false; // PWA or Safari, not in-app browser
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
  static detectGmailApp(): boolean {
    if (!isDocumentAvailable() || !isNavigatorAvailable()) {
      return false;
    }

    const userAgent = getUserAgent();
    const referrer = getReferrer();

    // Only run on mobile devices
    if (!isIOSDevice(userAgent) && !isAndroidDevice(userAgent)) {
      return false;
    }

    // First check: explicit Gmail indicators
    const hasGmailRef = isGmailReferrer(referrer);
    const hasGsaToken = hasGoogleAppToken(userAgent);
    const hasWvToken = hasWebViewToken(userAgent);

    if (hasGmailRef || hasGsaToken) {
      return true;
    }

    // Exclude regular Safari browser
    if (REGEX_PATTERNS.SAFARI.test(userAgent) && !hasWvToken) {
      return false;
    }

    // Gmail on Android often uses Chrome WebView/Custom Tabs
    try {
      if (isAndroidDevice(userAgent) && REGEX_PATTERNS.CHROME.test(userAgent)) {
        if (hasWvToken) {
          const isWebViewIndicator = this.detectWebView(userAgent);
          if (isWebViewIndicator) {
            return true;
          }
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Detect WebView indicators from a user agent string
   * 
   * @param {string} userAgent - Lowercase user agent string
   * @returns {boolean} True if WebView is detected
   */
  static detectWebView(userAgent: string): boolean {
    if (!isWindowAvailable() || !isNavigatorAvailable()) {
      return false;
    }

    // Exclude known regular browsers
    if (
      REGEX_PATTERNS.DUCKDUCKGO.test(userAgent) ||
      REGEX_PATTERNS.EDGE.test(userAgent) ||
      REGEX_PATTERNS.BRAVE.test(userAgent) ||
      hasBraveFeature() ||
      REGEX_PATTERNS.FIREFOX.test(userAgent) ||
      REGEX_PATTERNS.OPERA.test(userAgent) ||
      REGEX_PATTERNS.VIVALDI.test(userAgent)
    ) {
      return false;
    }

    // WebView detection methods
    const webViewWindow = window as ReactNativeWebViewWindow;
    if (webViewWindow.ReactNativeWebView) {
      return true;
    }

    // Check for WebView token patterns
    if (hasWebViewToken(userAgent)) {
      return true;
    }

    // Android WebView detection
    if (isAndroidDevice(userAgent)) {
      const hasVersionPattern = REGEX_PATTERNS.VERSION_PATTERN.test(userAgent);
      const hasChromePattern = REGEX_PATTERNS.CHROME_PATTERN.test(userAgent);

      if (hasVersionPattern) {
        const versionIndex = userAgent.indexOf('version/');
        const chromeIndex = userAgent.indexOf('chrome/');

        // If Version/ comes before Chrome/ OR Chrome/ is missing, it's likely WebView
        if (!hasChromePattern || chromeIndex > versionIndex) {
          if (
            !REGEX_PATTERNS.DUCKDUCKGO.test(userAgent) &&
            !REGEX_PATTERNS.BRAVE.test(userAgent) &&
            !hasBraveFeature()
          ) {
            return true;
          }
        }
      }

      // Check for Chrome WebView
      if (REGEX_PATTERNS.CHROME.test(userAgent)) {
        // Regular Chrome has browser UI, WebView doesn't
        if (hasBrowserUI() || hasNormalScreenLayout()) {
          return false;
        }

        // Explicit WebView token found
        if (hasWebViewToken(userAgent)) {
          return true;
        }

        // Check for standalone display mode (PWA, not in-app browser)
        if (isStandaloneMode()) {
          return false;
        }

        // No explicit token: do not classify as WebView to avoid false positives
        return false;
      }
    }

    return false;
  }

  /**
   * Check viewport behavior typical of in-app browsers
   * 
   * @returns {boolean} True if viewport behavior suggests in-app browser
   */
  static checkViewportBehavior(): boolean {
    if (!isDocumentAvailable() || !isWindowAvailable()) {
      return false;
    }

    try {
      const viewport = document.querySelector('meta[name="viewport"]');
      const hasRestrictiveViewport =
        viewport?.getAttribute('content')?.includes('user-scalable=no') ?? false;
      const isSmallViewport =
        window.innerWidth < BROWSER_UI_THRESHOLDS.SMALL_VIEWPORT ||
        window.innerHeight < BROWSER_UI_THRESHOLDS.SMALL_VIEWPORT;

      return hasRestrictiveViewport || isSmallViewport;
    } catch {
      return false;
    }
  }

  /**
   * Get the browser name
   * 
   * @returns {BrowserName} Browser name string
   */
  static getBrowserName(): BrowserName {
    if (!isNavigatorAvailable()) {
      return BROWSER_NAME_MAP.UNKNOWN;
    }

    const userAgent = getUserAgent();

    // Check for in-app browsers FIRST
    if (hasGoogleAppToken(userAgent)) {
      return BROWSER_NAME_MAP.GSA;
    }
    if (userAgent.includes('fban') || userAgent.includes('fbav')) {
      return BROWSER_NAME_MAP.FBAN;
    }
    if (userAgent.includes('twitter')) {
      return BROWSER_NAME_MAP.TWITTER;
    }
    if (userAgent.includes('instagram')) {
      return BROWSER_NAME_MAP.INSTAGRAM;
    }
    if (userAgent.includes('linkedinapp')) {
      return BROWSER_NAME_MAP.LINKEDINAPP;
    }
    if (userAgent.includes('snapchat')) {
      return BROWSER_NAME_MAP.SNAPCHAT;
    }
    if (userAgent.includes('whatsapp')) {
      return BROWSER_NAME_MAP.WHATSAPP;
    }
    if (userAgent.includes('line')) {
      return BROWSER_NAME_MAP.LINE;
    }
    if (userAgent.includes('discord')) {
      return BROWSER_NAME_MAP.DISCORD;
    }
    if (userAgent.includes('telegram')) {
      return BROWSER_NAME_MAP.TELEGRAM;
    }
    if (this.detectGmailApp()) {
      return BROWSER_NAME_MAP.GMAIL;
    }

    // Check for regular browsers
    const regularBrowser = isKnownRegularBrowser(userAgent);
    
    if (regularBrowser.isEdge) {
      return 'Edge';
    }
    if (regularBrowser.isDuckDuckGo) {
      return 'DuckDuckGo';
    }
    if (regularBrowser.isBrave) {
      return 'Brave';
    }
    if (REGEX_PATTERNS.CRIOS.test(userAgent)) {
      return 'Chrome';
    }
    if (REGEX_PATTERNS.CHROME.test(userAgent) && !hasWebViewToken(userAgent)) {
      return 'Chrome';
    }
    if (regularBrowser.isFirefox) {
      return 'Firefox';
    }
    if (regularBrowser.isSafari) {
      return 'Safari';
    }
    if (regularBrowser.isOpera) {
      return 'Opera';
    }
    if (regularBrowser.isVivaldi) {
      return 'Vivaldi';
    }

    // Only check for WebView if no regular browser was found
    if (this.detectWebView(userAgent)) {
      return BROWSER_NAME_MAP.WEBVIEW;
    }

    return BROWSER_NAME_MAP.UNKNOWN;
  }

  /**
   * Get the current page URL
   * 
   * @returns {string} Current page URL
   */
  static getCurrentPageUrl(): string {
    if (!isWindowAvailable()) {
      return '';
    }
    try {
      return window.location.href;
    } catch {
      return '';
    }
  }

  /**
   * Update detection info in the DOM (for demo purposes)
   * 
   * @param {string} userAgent - User agent string
   */
  static updateDetectionInfo(userAgent: string): void {
    if (!isDocumentAvailable() || !isWindowAvailable()) {
      return;
    }

    try {
      const userAgentElement = document.getElementById('user-agent');
      if (userAgentElement) {
        userAgentElement.textContent = userAgent;
      }

      // Diagnostics for debugging
      const diagnostics = {
        ow: document.getElementById('ow'),
        iw: document.getElementById('iw'),
        oh: document.getElementById('oh'),
        ih: document.getElementById('ih'),
        share: document.getElementById('share-exists'),
        standalone: document.getElementById('standalone'),
        referrer: document.getElementById('doc-referrer'),
      };

      if (diagnostics.ow) {
        diagnostics.ow.textContent = String(window.outerWidth);
      }
      if (diagnostics.iw) {
        diagnostics.iw.textContent = String(window.innerWidth);
      }
      if (diagnostics.oh) {
        diagnostics.oh.textContent = String(window.innerHeight);
      }
      if (diagnostics.ih) {
        diagnostics.ih.textContent = String(window.innerHeight);
      }
      if (diagnostics.share) {
        const hasShare = isNavigatorAvailable() && typeof navigator.share !== 'undefined';
        diagnostics.share.textContent = hasShare ? 'true' : 'false';
      }
      if (diagnostics.standalone) {
        diagnostics.standalone.textContent = isStandaloneMode() ? 'true' : 'false';
      }
      if (diagnostics.referrer) {
        diagnostics.referrer.textContent = document.referrer || '';
      }
    } catch {
      // Ignore diagnostics errors
    }
  }
}
