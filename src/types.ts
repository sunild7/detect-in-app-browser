/**
 * Type definitions for detect-in-app-browser
 */

/**
 * Browser name types
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
  | 'Snapchat'
  | 'WhatsApp'
  | 'Line'
  | 'Discord'
  | 'Telegram'
  | 'Viber'
  | 'WeChat'
  | 'QQ'
  | 'Gmail'
  | 'Google App'
  | 'WebView'
  | 'Unknown Browser';

/**
 * Operating system name types
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
 * Extended Navigator interface with Brave support
 */
export interface BraveNavigator extends Navigator {
  brave?: {
    isBrave: () => Promise<boolean> | boolean;
  };
}

/**
 * Extended Window interface with React Native WebView
 */
export interface ReactNativeWebViewWindow extends Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
}

