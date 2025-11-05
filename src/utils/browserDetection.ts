/**
 * Browser detection utilities
 */

import type { BraveNavigator } from '../types.js';
import { REGEX_PATTERNS, BROWSER_UI_THRESHOLDS } from '../constants.js';

/**
 * Check if navigator is available
 */
export function isNavigatorAvailable(): boolean {
  return typeof navigator !== 'undefined';
}

/**
 * Check if window is available
 */
export function isWindowAvailable(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if document is available
 */
export function isDocumentAvailable(): boolean {
  return typeof document !== 'undefined';
}

/**
 * Get user agent string (lowercase)
 */
export function getUserAgent(): string {
  if (!isNavigatorAvailable()) {
    return '';
  }
  return navigator.userAgent.toLowerCase();
}

/**
 * Get document referrer (lowercase)
 */
export function getReferrer(): string {
  if (!isDocumentAvailable()) {
    return '';
  }
  return (document.referrer || '').toLowerCase();
}

/**
 * Check if device is mobile based on user agent
 */
export function isMobileDevice(userAgent: string): boolean {
  return REGEX_PATTERNS.MOBILE.test(userAgent);
}

/**
 * Check if device is Android
 */
export function isAndroidDevice(userAgent: string): boolean {
  return REGEX_PATTERNS.ANDROID.test(userAgent);
}

/**
 * Check if device is iOS
 */
export function isIOSDevice(userAgent: string): boolean {
  return REGEX_PATTERNS.IOS.test(userAgent);
}

/**
 * Check if browser has Brave feature
 */
export function hasBraveFeature(): boolean {
  if (!isNavigatorAvailable()) {
    return false;
  }
  const braveNav = navigator as BraveNavigator;
  return !!(braveNav.brave && typeof braveNav.brave.isBrave === 'function');
}

/**
 * Check if browser has explicit WebView token
 */
export function hasWebViewToken(userAgent: string): boolean {
  return REGEX_PATTERNS.WV_TOKEN.test(userAgent);
}

/**
 * Check if browser has Google Search App token
 */
export function hasGoogleAppToken(userAgent: string): boolean {
  return REGEX_PATTERNS.GSA_TOKEN.test(userAgent);
}

/**
 * Check if referrer is from Android app
 */
export function isAndroidAppReferrer(referrer: string): boolean {
  return REGEX_PATTERNS.ANDROID_APP_REFERRER.test(referrer);
}

/**
 * Check if referrer is from Gmail
 */
export function isGmailReferrer(referrer: string): boolean {
  return REGEX_PATTERNS.GMAIL_REFERRER.test(referrer);
}

/**
 * Check if browser has visible browser UI
 */
export function hasBrowserUI(): boolean {
  if (!isWindowAvailable()) {
    return false;
  }
  try {
    const outerDiffW = window.outerWidth - window.innerWidth;
    const outerDiffH = window.outerHeight - window.innerHeight;
    return (
      outerDiffW > BROWSER_UI_THRESHOLDS.OUTER_DIFF ||
      outerDiffH > BROWSER_UI_THRESHOLDS.OUTER_DIFF
    );
  } catch {
    return false;
  }
}

/**
 * Check if browser has normal screen layout
 */
export function hasNormalScreenLayout(): boolean {
  if (!isWindowAvailable() || typeof screen === 'undefined') {
    return false;
  }
  try {
    const screenDiff = screen.width - window.outerWidth;
    return screenDiff > BROWSER_UI_THRESHOLDS.SCREEN_DIFF;
  } catch {
    return false;
  }
}

/**
 * Check if browser is in standalone mode (PWA)
 */
export function isStandaloneMode(): boolean {
  if (!isWindowAvailable()) {
    return false;
  }
  try {
    return !!(
      window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
    );
  } catch {
    return false;
  }
}

/**
 * Check if browser is a known regular browser (not in-app)
 */
export function isKnownRegularBrowser(userAgent: string): {
  isRegular: boolean;
  isSafari: boolean;
  isEdge: boolean;
  isFirefox: boolean;
  isOpera: boolean;
  isDuckDuckGo: boolean;
  isBrave: boolean;
  isVivaldi: boolean;
} {
  const isSafari =
    REGEX_PATTERNS.SAFARI.test(userAgent) &&
    !REGEX_PATTERNS.CHROME.test(userAgent) &&
    !REGEX_PATTERNS.CRIOS.test(userAgent) &&
    !REGEX_PATTERNS.WV_TOKEN.test(userAgent) &&
    !REGEX_PATTERNS.GSA_TOKEN.test(userAgent);
  const isEdge = REGEX_PATTERNS.EDGE.test(userAgent);
  const isFirefox = REGEX_PATTERNS.FIREFOX.test(userAgent);
  const isOpera = REGEX_PATTERNS.OPERA.test(userAgent);
  const isDuckDuckGo = REGEX_PATTERNS.DUCKDUCKGO.test(userAgent);
  const isBrave = REGEX_PATTERNS.BRAVE.test(userAgent) || hasBraveFeature();
  const isVivaldi = REGEX_PATTERNS.VIVALDI.test(userAgent);

  const isRegular =
    isSafari || isEdge || isFirefox || isOpera || isDuckDuckGo || isBrave || isVivaldi;

  return {
    isRegular,
    isSafari,
    isEdge,
    isFirefox,
    isOpera,
    isDuckDuckGo,
    isBrave,
    isVivaldi,
  };
}

