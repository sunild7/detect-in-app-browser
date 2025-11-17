/**
 * In-App Browser Detection Library
 * Detects if the current browser is an in-app browser (WebView) or a regular browser
 *
 * @version 1.0.0
 * @license MIT
 */
import type { BrowserName, EnvironmentInfo } from './types.js';
export declare class InAppBrowserDetector {
    /**
     * Detect if the current context is an in-app browser.
     */
    static detectInAppBrowser(userAgentOverride?: string, referrerOverride?: string): boolean;
    /**
     * Convenience helper to expose browser/environment information parsed via Bowser.
     */
    static getEnvironmentInfo(userAgentOverride?: string): EnvironmentInfo;
    /**
     * Get the browser name by delegating to Bowser.
     */
    static getBrowserName(userAgentOverride?: string): BrowserName;
    /**
     * Get the current page URL.
     */
    static getCurrentPageUrl(): string;
    private static getUserAgent;
    private static getReferrer;
    private static hasKnownReferrer;
}
//# sourceMappingURL=InAppBrowserDetector.d.ts.map