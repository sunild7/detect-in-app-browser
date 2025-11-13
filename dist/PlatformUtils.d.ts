/**
 * Platform Detection Utilities
 * Provides helper functions for detecting platform and browser capabilities
 *
 * @version 1.0.0
 * @license MIT
 */
import type { OSName } from './types.js';
export declare class PlatformUtils {
    /**
     * Check if the current device is Android
     *
     * @returns {boolean} True if Android device
     *
     * @example
     * ```typescript
     * if (PlatformUtils.isAndroid()) {
     *   console.log('Android device detected');
     * }
     * ```
     */
    static isAndroid(): boolean;
    /**
     * Check if the current device is iOS
     *
     * @returns {boolean} True if iOS device
     *
     * @example
     * ```typescript
     * if (PlatformUtils.isIOS()) {
     *   console.log('iOS device detected');
     * }
     * ```
     */
    static isIOS(): boolean;
    /**
     * Check if the current device is mobile
     *
     * @returns {boolean} True if mobile device
     *
     * @example
     * ```typescript
     * if (PlatformUtils.isMobile()) {
     *   console.log('Mobile device');
     * }
     * ```
     */
    static isMobile(): boolean;
    /**
     * Check if the current device is desktop
     *
     * @returns {boolean} True if desktop device
     */
    static isDesktop(): boolean;
    /**
     * Get the operating system name
     *
     * @returns {OSName} Operating system name
     *
     * @example
     * ```typescript
     * const os = PlatformUtils.getOS();
     * console.log('Operating System:', os);
     * ```
     */
    static getOS(): OSName;
    /**
     * Get the operating system version
     *
     * @returns {string} OS version string or 'Unknown'
     *
     * @example
     * ```typescript
     * const osVersion = PlatformUtils.getOSVersion();
     * console.log('OS Version:', osVersion);
     * ```
     */
    static getOSVersion(): string;
    /**
     * Get the browser version
     *
     * @returns {string} Browser version string or 'Unknown'
     *
     * @example
     * ```typescript
     * const browserVersion = PlatformUtils.getBrowserVersion();
     * console.log('Browser Version:', browserVersion);
     * ```
     */
    static getBrowserVersion(): string;
}
//# sourceMappingURL=PlatformUtils.d.ts.map