/**
 * In-App Browser Detection Library
 * Detects if the current browser is an in-app browser (WebView) or a regular browser
 *
 * @version 1.0.0
 * @license MIT
 */
import type { BrowserName } from './types.js';
export declare class InAppBrowserDetector {
    /**
     * Main detection method
     * Detects if the current browser is an in-app browser (WebView)
     *
     * @returns {boolean} True if in-app browser is detected, false otherwise
     *
     * @example
     * ```typescript
     * const isInApp = InAppBrowserDetector.detectInAppBrowser();
     * if (isInApp) {
     *   console.log('User is in an in-app browser');
     * }
     * ```
     */
    static detectInAppBrowser(): boolean;
    /**
     * Detect Gmail App specifically
     *
     * @returns {boolean} True if Gmail app browser is detected
     */
    static detectGmailApp(): boolean;
    /**
     * Detect WebView indicators from a user agent string
     *
     * @param {string} userAgent - Lowercase user agent string
     * @returns {boolean} True if WebView is detected
     */
    static detectWebView(userAgent: string): boolean;
    /**
     * Get the browser name
     *
     * @returns {BrowserName} Browser name
     *
     * @example
     * ```typescript
     * const browserName = InAppBrowserDetector.getBrowserName();
     * console.log('Browser:', browserName);
     * ```
     */
    static getBrowserName(): BrowserName;
    /**
     * Get the current page URL
     *
     * @returns {string} Current page URL
     */
    static getCurrentPageUrl(): string;
}
//# sourceMappingURL=InAppBrowserDetector.d.ts.map