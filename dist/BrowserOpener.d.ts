/**
 * Browser Opener Utility
 * Provides functions to open URLs in system browsers (Chrome and Safari)
 *
 * @version 1.0.0
 * @license MIT
 */
export declare class BrowserOpener {
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
    static openInChrome(url?: string): boolean;
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
    static openInSafari(url?: string): boolean;
    /**
     * Check if Chrome is likely available on the device
     *
     * @returns {boolean} True if Chrome might be available
     */
    static isChromeAvailable(): boolean;
    /**
     * Check if Safari is likely available on the device
     *
     * @returns {boolean} True if Safari might be available (iOS only)
     */
    static isSafariAvailable(): boolean;
}
//# sourceMappingURL=BrowserOpener.d.ts.map