/**
 * Platform Detection Utilities
 * Provides helper functions for detecting platform and browser capabilities
 * 
 * @version 1.0.0
 * @license MIT
 */

export class PlatformUtils {
  /**
   * Check if the current device is Android
   * 
   * @returns {boolean} True if Android device
   * 
   * @example
   * ```javascript
   * if (PlatformUtils.isAndroid()) {
   *   console.log('Android device detected');
   * }
   * ```
   */
  static isAndroid() {
    if (typeof navigator === 'undefined') {
      return false;
    }
    return /android/i.test(navigator.userAgent);
  }

  /**
   * Check if the current device is iOS
   * 
   * @returns {boolean} True if iOS device
   * 
   * @example
   * ```javascript
   * if (PlatformUtils.isIOS()) {
   *   console.log('iOS device detected');
   * }
   * ```
   */
  static isIOS() {
    if (typeof navigator === 'undefined') {
      return false;
    }
    return /iphone|ipad/i.test(navigator.userAgent);
  }

  /**
   * Check if the current device is mobile
   * 
   * @returns {boolean} True if mobile device
   * 
   * @example
   * ```javascript
   * if (PlatformUtils.isMobile()) {
   *   console.log('Mobile device');
   * }
   * ```
   */
  static isMobile() {
    if (typeof navigator === 'undefined') {
      return false;
    }
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
  }

  /**
   * Check if the current device is desktop
   * 
   * @returns {boolean} True if desktop device
   */
  static isDesktop() {
    return !this.isMobile();
  }

  /**
   * Get the operating system name
   * 
   * @returns {string} Operating system name (e.g., 'Android', 'iOS', 'Windows', 'macOS', etc.)
   * 
   * @example
   * ```javascript
   * const os = PlatformUtils.getOS();
   * console.log('Operating System:', os);
   * ```
   */
  static getOS() {
    if (typeof navigator === 'undefined') {
      return 'Unknown';
    }

    const userAgent = navigator.userAgent;
    
    if (/android/i.test(userAgent)) {
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
   * 
   * @example
   * ```javascript
   * const osVersion = PlatformUtils.getOSVersion();
   * console.log('OS Version:', osVersion);
   * ```
   */
  static getOSVersion() {
    if (typeof navigator === 'undefined') {
      return 'Unknown';
    }

    const userAgent = navigator.userAgent;
    
    // Android version
    if (/android/i.test(userAgent)) {
      const match = userAgent.match(/android\s([\d.]+)/i);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // iOS version - try multiple patterns and return highest
    if (/iphone|ipad|ipod/i.test(userAgent)) {
      const versions = [];
      
      const parseVersion = (versionStr) => {
        if (!versionStr) return null;
        const version = versionStr.replace(/_/g, '.');
        if (version.match(/^\d+\.\d+(\.\d+)?$/)) {
          return version;
        }
        return null;
      };
      
      const patterns = [
        /cpu\s+iphone\s+os\s+([\d_]+)/i,
        /cpu\s+os\s+([\d_]+)\s+like\s+mac\s+os\s+x/i,
        /iphone\s+os\s+([\d_]+)/i,
        /(?:^|[^a-z])os\s+([\d_]+)\s+like\s+mac/i,
        /\([^)]*os\s+([\d_]+)\s+like\s+mac[^)]*\)/i,
        /\([^)]*;\s*os\s+([\d_]+)\s+[^)]*\)/i,
      ];

      for (const pattern of patterns) {
        const match = userAgent.match(pattern);
        if (match && match[1]) {
          const version = parseVersion(match[1]);
          if (version) {
            versions.push(version);
          }
        }
      }
      
      if (versions.length > 0) {
        const uniqueVersions = [...new Set(versions)];
        
        uniqueVersions.sort((a, b) => {
          const aParts = a.split('.').map(Number);
          const bParts = b.split('.').map(Number);
          const maxLength = Math.max(aParts.length, bParts.length);

          for (let i = 0; i < maxLength; i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            if (bPart !== aPart) {
              return bPart - aPart;
            }
          }
          return 0;
        });
        
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
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // macOS version
    if (/mac os x/i.test(userAgent)) {
      const match = userAgent.match(/mac os x\s([\d_]+)/i);
      if (match && match[1]) {
        return match[1].replace(/_/g, '.');
      }
    }
    
    return 'Unknown';
  }

  /**
   * Get the browser version
   * 
   * @returns {string} Browser version string or 'Unknown'
   * 
   * @example
   * ```javascript
   * const browserVersion = PlatformUtils.getBrowserVersion();
   * console.log('Browser Version:', browserVersion);
   * ```
   */
  static getBrowserVersion() {
    if (typeof navigator === 'undefined') {
      return 'Unknown';
    }

    const userAgent = navigator.userAgent;
    
    // Chrome/Chromium version
    const chromeMatch = userAgent.match(/(?:chrome|crios|edg)\/([\d.]+)/i);
    if (chromeMatch && chromeMatch[1]) {
      return chromeMatch[1];
    }
    
    // Firefox version
    const firefoxMatch = userAgent.match(/firefox\/([\d.]+)/i);
    if (firefoxMatch && firefoxMatch[1]) {
      return firefoxMatch[1];
    }
    
    // Safari version
    const safariMatch = userAgent.match(/version\/([\d.]+)/i);
    if (safariMatch && safariMatch[1]) {
      return safariMatch[1];
    }
    
    // Edge version
    const edgeMatch = userAgent.match(/edg\/([\d.]+)/i);
    if (edgeMatch && edgeMatch[1]) {
      return edgeMatch[1];
    }
    
    // Opera version
    const operaMatch = userAgent.match(/(?:opera|opr)\/([\d.]+)/i);
    if (operaMatch && operaMatch[1]) {
      return operaMatch[1];
    }
    
    // Brave version (uses Chrome version)
    if (userAgent.includes('brave')) {
      const braveMatch = userAgent.match(/chrome\/([\d.]+)/i);
      if (braveMatch && braveMatch[1]) {
        return braveMatch[1];
      }
    }
    
    return 'Unknown';
  }
}

