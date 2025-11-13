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
import { BrowserOpener } from './BrowserOpener.js';
export { InAppBrowserDetector } from './InAppBrowserDetector.js';
export { PlatformUtils } from './PlatformUtils.js';
export { BrowserOpener } from './BrowserOpener.js';
export type { BrowserName, OSName, BraveNavigator, ReactNativeWebViewWindow } from './types.js';
declare const _default: {
    InAppBrowserDetector: typeof InAppBrowserDetector;
    PlatformUtils: typeof PlatformUtils;
    BrowserOpener: typeof BrowserOpener;
};
export default _default;
//# sourceMappingURL=index.d.ts.map