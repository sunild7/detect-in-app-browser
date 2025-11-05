/**
 * Type definitions for detect-in-app-browser
 */

/**
 * Browser name type
 */
export type BrowserName =
  | 'Chrome'
  | 'Safari'
  | 'Firefox'
  | 'Edge'
  | 'Opera'
  | 'Brave'
  | 'DuckDuckGo'
  | 'Vivaldi'
  | 'Facebook'
  | 'Twitter'
  | 'Instagram'
  | 'LinkedIn'
  | 'Gmail'
  | 'Google App'
  | 'WhatsApp'
  | 'Snapchat'
  | 'Line'
  | 'Discord'
  | 'Telegram'
  | 'WebView'
  | 'Unknown Browser';

/**
 * Operating system name type
 */
export type OSName =
  | 'Android'
  | 'iOS'
  | 'iPadOS'
  | 'Windows'
  | 'macOS'
  | 'Linux'
  | 'Ubuntu'
  | 'Unknown';

/**
 * Extended Navigator interface for Brave browser
 */
export interface BraveNavigator extends Navigator {
  brave?: {
    isBrave: () => boolean;
  };
}

/**
 * Extended Window interface for React Native WebView
 */
export interface ReactNativeWebViewWindow extends Window {
  ReactNativeWebView?: unknown;
}

