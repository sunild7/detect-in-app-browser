/**
 * detect-in-app-browser
 * Main entry point for the library
 * 
 * A simple library to detect in-app browsers (WebView) and differentiate
 * them from regular browsers. Supports detection of Facebook, Twitter,
 * Instagram, Gmail, and other in-app browsers.
 * 
 * @version 1.0.0
 * @license MIT
 */

import { InAppBrowserDetector } from './InAppBrowserDetector.js';
import { PlatformUtils } from './PlatformUtils.js';

// Named exports
export { InAppBrowserDetector } from './InAppBrowserDetector.js';
export { PlatformUtils } from './PlatformUtils.js';

// Type exports
export type { BrowserName, OSName, BraveNavigator, ReactNativeWebViewWindow } from './types.js';

// Default export for convenience
export default {
  InAppBrowserDetector,
  PlatformUtils,
};

