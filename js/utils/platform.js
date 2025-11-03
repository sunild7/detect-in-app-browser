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
}
