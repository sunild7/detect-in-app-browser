/**
 * detect-in-app-browser
 * Main entry point for the npm package
 * 
 * A TypeScript library to detect in-app browsers (WebView) and differentiate
 * them from regular browsers. Supports detection of Facebook, Twitter,
 * Instagram, Gmail, and other in-app browsers.
 * 
 * @example
 * ```typescript
 * import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';
 * 
 * const isInApp = InAppBrowserDetector.detectInAppBrowser();
 * const browserName = InAppBrowserDetector.getBrowserName();
 * const isMobile = PlatformUtils.isMobile();
 * ```
 * 
 * @packageDocumentation
 */

import { InAppBrowserDetector } from './InAppBrowserDetector.js';
import { PlatformUtils } from './utils/platform.js';

// Named exports
export { InAppBrowserDetector } from './InAppBrowserDetector.js';
export { PlatformUtils } from './utils/platform.js';
export type { BrowserName, OSName, BraveNavigator, ReactNativeWebViewWindow } from './types.js';

// Re-export utilities for advanced usage
export {
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

// Re-export constants for reference
export {
  KNOWN_IN_APP_BROWSERS,
  REGEX_PATTERNS,
  BROWSER_UI_THRESHOLDS,
  BROWSER_NAME_MAP,
} from './constants.js';

// Default export for convenience
export default {
  InAppBrowserDetector,
  PlatformUtils,
};
