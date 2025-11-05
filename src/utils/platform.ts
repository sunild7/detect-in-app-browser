/**
 * Platform Detection Utilities
 * Provides helper functions for detecting platform and browser capabilities
 */

import type { OSName } from '../types.js';
import { REGEX_PATTERNS } from '../constants.js';

/**
 * Platform Detection Utilities
 * 
 * Provides static methods to detect platform information including
 * operating system, device type, and browser versions.
 * 
 * @example
 * ```typescript
 * const isMobile = PlatformUtils.isMobile();
 * const os = PlatformUtils.getOS();
 * const osVersion = PlatformUtils.getOSVersion();
 * ```
 */
export class PlatformUtils {
  /**
   * Check if the current device is Android
   * 
   * @returns {boolean} True if Android device
   */
  static isAndroid(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }
    return REGEX_PATTERNS.ANDROID.test(navigator.userAgent);
  }

  /**
   * Check if the current device is iOS
   * 
   * @returns {boolean} True if iOS device
   */
  static isIOS(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }
    return REGEX_PATTERNS.IOS.test(navigator.userAgent);
  }

  /**
   * Check if the current device is mobile
   * 
   * @returns {boolean} True if mobile device
   */
  static isMobile(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }
    return REGEX_PATTERNS.MOBILE.test(navigator.userAgent);
  }

  /**
   * Check if the current device is desktop
   * 
   * @returns {boolean} True if desktop device
   */
  static isDesktop(): boolean {
    return !this.isMobile();
  }

  /**
   * Get the operating system name
   * 
   * @returns {OSName} Operating system name
   */
  static getOS(): OSName {
    if (typeof navigator === 'undefined') {
      return 'Unknown';
    }

    const userAgent = navigator.userAgent;

    if (REGEX_PATTERNS.ANDROID.test(userAgent)) {
      return 'Android';
    }
    if (/iphone/i.test(userAgent)) {
      return 'iOS';
    }
    if (/ipad/i.test(userAgent)) {
      return 'iPadOS';
    }
    if (/windows/i.test(userAgent)) {
      return 'Windows';
    }
    if (/macintosh|mac os x/i.test(userAgent)) {
      return 'macOS';
    }
    if (/linux/i.test(userAgent)) {
      return 'Linux';
    }
    if (/ubuntu/i.test(userAgent)) {
      return 'Ubuntu';
    }

    return 'Unknown';
  }

  /**
   * Get the operating system version
   * 
   * @returns {string} OS version string or 'Unknown'
   */
  static getOSVersion(): string {
    if (typeof navigator === 'undefined') {
      return 'Unknown';
    }

    const userAgent = navigator.userAgent;

    // Android version
    if (REGEX_PATTERNS.ANDROID.test(userAgent)) {
      const match = userAgent.match(/android\s([\d.]+)/i);
      if (match?.[1]) {
        return match[1];
      }
    }

    // iOS version - try multiple patterns and return highest
    if (REGEX_PATTERNS.IOS.test(userAgent)) {
      const versions: string[] = [];

      // Helper function to parse and validate version
      const parseVersion = (versionStr: string | null | undefined): string | null => {
        if (!versionStr) {
          return null;
        }
        const version = versionStr.replace(/_/g, '.');
        // Match version pattern like "26.1", "18.7", "26.1.0", etc.
        if (version.match(/^\d+\.\d+(\.\d+)?$/)) {
          return version;
        }
        return null;
      };

      // Try all possible iOS version patterns
      const patterns = [
        REGEX_PATTERNS.IOS_VERSION_PATTERNS.CPU_IPHONE_OS,
        REGEX_PATTERNS.IOS_VERSION_PATTERNS.CPU_OS_LIKE_MAC,
        REGEX_PATTERNS.IOS_VERSION_PATTERNS.IPHONE_OS,
        REGEX_PATTERNS.IOS_VERSION_PATTERNS.OS_LIKE_MAC,
        REGEX_PATTERNS.IOS_VERSION_PATTERNS.PARENTHESES_OS_LIKE_MAC,
        REGEX_PATTERNS.IOS_VERSION_PATTERNS.PARENTHESES_OS,
      ];

      for (const pattern of patterns) {
        const match = userAgent.match(pattern);
        if (match?.[1]) {
          const version = parseVersion(match[1]);
          if (version) {
            versions.push(version);
          }
        }
      }

      // Remove duplicates and return the HIGHEST version number
      if (versions.length > 0) {
        const uniqueVersions = [...new Set(versions)];

        // Sort by version number (highest first)
        uniqueVersions.sort((a, b) => {
          const aParts = a.split('.').map(Number);
          const bParts = b.split('.').map(Number);
          const maxLength = Math.max(aParts.length, bParts.length);

          for (let i = 0; i < maxLength; i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            if (bPart !== aPart) {
              return bPart - aPart; // Higher version first
            }
          }
          return 0;
        });

        // Return the highest version
        return uniqueVersions[0];
      }
    }

    // Windows version
    if (/windows/i.test(userAgent)) {
      if (/windows nt 10.0/i.test(userAgent)) {
        return '10';
      }
      if (/windows nt 6.3/i.test(userAgent)) {
        return '8.1';
      }
      if (/windows nt 6.2/i.test(userAgent)) {
        return '8';
      }
      if (/windows nt 6.1/i.test(userAgent)) {
        return '7';
      }
      const match = userAgent.match(/windows nt\s([\d.]+)/i);
      if (match?.[1]) {
        return match[1];
      }
    }

    // macOS version
    if (/mac os x/i.test(userAgent)) {
      const match = userAgent.match(/mac os x\s([\d_]+)/i);
      if (match?.[1]) {
        return match[1].replace(/_/g, '.');
      }
    }

    return 'Unknown';
  }

  /**
   * Get the browser version
   * 
   * @returns {string} Browser version string or 'Unknown'
   */
  static getBrowserVersion(): string {
    if (typeof navigator === 'undefined') {
      return 'Unknown';
    }

    const userAgent = navigator.userAgent;

    // Chrome/Chromium version
    const chromeMatch = userAgent.match(REGEX_PATTERNS.BROWSER_VERSION.CHROME);
    if (chromeMatch?.[1]) {
      return chromeMatch[1];
    }

    // Firefox version
    const firefoxMatch = userAgent.match(REGEX_PATTERNS.BROWSER_VERSION.FIREFOX);
    if (firefoxMatch?.[1]) {
      return firefoxMatch[1];
    }

    // Safari version (iOS Safari uses Version)
    const safariMatch = userAgent.match(REGEX_PATTERNS.BROWSER_VERSION.SAFARI);
    if (safariMatch?.[1]) {
      return safariMatch[1];
    }

    // Edge version
    const edgeMatch = userAgent.match(REGEX_PATTERNS.BROWSER_VERSION.EDGE);
    if (edgeMatch?.[1]) {
      return edgeMatch[1];
    }

    // Opera version
    const operaMatch = userAgent.match(REGEX_PATTERNS.BROWSER_VERSION.OPERA);
    if (operaMatch?.[1]) {
      return operaMatch[1];
    }

    // Brave version (uses Chrome version)
    if (REGEX_PATTERNS.BRAVE.test(userAgent)) {
      const braveMatch = userAgent.match(REGEX_PATTERNS.BROWSER_VERSION.CHROME_VERSION);
      if (braveMatch?.[1]) {
        return braveMatch[1];
      }
    }

    return 'Unknown';
  }
}
