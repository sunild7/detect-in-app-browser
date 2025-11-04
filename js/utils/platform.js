/**
 * Platform Detection Utilities
 * Provides helper functions for detecting platform and browser capabilities
 */

export class PlatformUtils {
  /**
   * Check if the current device is Android
   * @returns {boolean}
   */
  static isAndroid() {
    return /android/i.test(navigator.userAgent);
  }

  /**
   * Check if the current device is iOS
   * @returns {boolean}
   */
  static isIOS() {
    return /iphone|ipad/i.test(navigator.userAgent);
  }

  /**
   * Check if the current device is mobile
   * @returns {boolean}
   */
  static isMobile() {
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
  }

  /**
   * Check if the current device is desktop
   * @returns {boolean}
   */
  static isDesktop() {
    return !this.isMobile();
  }

  /**
   * Get the operating system name
   * @returns {string}
   */
  static getOS() {
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
   * @returns {string}
   */
  static getOSVersion() {
    const userAgent = navigator.userAgent;
    
    // Android version
    if (/android/i.test(userAgent)) {
      const match = userAgent.match(/android\s([\d.]+)/i);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // iOS version
    // iOS user agents typically have: "CPU iPhone OS X_Y like Mac OS X" or "CPU OS X_Y like Mac OS X"
    // Different browsers (Safari, Chrome, Edge, DuckDuckGo) may format iOS versions differently
    // We need to find ALL possible iOS version patterns and return the HIGHEST version
    if (/iphone|ipad|ipod/i.test(userAgent)) {
      const versions = [];
      
      // Helper function to parse and validate version
      const parseVersion = (versionStr) => {
        if (!versionStr) return null;
        const version = versionStr.replace(/_/g, '.');
        // Match version pattern like "26.1", "18.7", "26.1.0", etc.
        if (version.match(/^\d+\.\d+(\.\d+)?$/)) {
          return version;
        }
        return null;
      };
      
      // Try all possible iOS version patterns
      // Pattern 1: "CPU iPhone OS X_Y" (most specific for iPhone)
      let match = userAgent.match(/cpu\s+iphone\s+os\s+([\d_]+)/i);
      if (match && match[1]) {
        const version = parseVersion(match[1]);
        if (version) versions.push(version);
      }
      
      // Pattern 2: "CPU OS X_Y like Mac OS X" (for iPad, or alternative iPhone format)
      match = userAgent.match(/cpu\s+os\s+([\d_]+)\s+like\s+mac\s+os\s+x/i);
      if (match && match[1]) {
        const version = parseVersion(match[1]);
        if (version) versions.push(version);
      }
      
      // Pattern 3: "iPhone OS X_Y" (without CPU prefix)
      match = userAgent.match(/iphone\s+os\s+([\d_]+)/i);
      if (match && match[1]) {
        const version = parseVersion(match[1]);
        if (version) versions.push(version);
      }
      
      // Pattern 4: "OS X_Y like Mac" (fallback pattern)
      match = userAgent.match(/(?:^|[^a-z])os\s+([\d_]+)\s+like\s+mac/i);
      if (match && match[1]) {
        const version = parseVersion(match[1]);
        if (version) versions.push(version);
      }
      
      // Pattern 5: Look for any "OS X_Y" pattern in parentheses (for some browsers)
      // This catches patterns like "(iPhone; OS 26_1 like Mac OS X)"
      match = userAgent.match(/\([^)]*os\s+([\d_]+)\s+like\s+mac[^)]*\)/i);
      if (match && match[1]) {
        const version = parseVersion(match[1]);
        if (version) versions.push(version);
      }
      
      // Pattern 6: Edge browser sometimes includes iOS version in a different format
      // Look for patterns like "OS 26_1" that appear in different contexts
      // This is more conservative - only match if it's clearly in an iOS context
      match = userAgent.match(/\([^)]*;\s*os\s+([\d_]+)\s+[^)]*\)/i);
      if (match && match[1]) {
        const version = parseVersion(match[1]);
        if (version) versions.push(version);
      }
      
      // Remove duplicates and return the HIGHEST version number
      // This ensures we always get the correct iOS version regardless of which browser
      if (versions.length > 0) {
        // Remove duplicates
        const uniqueVersions = [...new Set(versions)];
        
        // Sort by version number (highest first)
        uniqueVersions.sort((a, b) => {
          const aParts = a.split('.').map(Number);
          const bParts = b.split('.').map(Number);
          for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
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
   * @returns {string}
   */
  static getBrowserVersion() {
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
    
    // Safari version (iOS Safari uses Version)
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
