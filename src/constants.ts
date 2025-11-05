/**
 * Constants for browser detection
 */

/**
 * Known in-app browser user agent tokens
 */
export const KNOWN_IN_APP_BROWSERS = [
  'fban',
  'fbav',
  'twitter',
  'linkedinapp',
  'instagram',
  'line',
  'whatsapp',
  'snapchat',
  'pinterest',
  'slack',
  'discord',
  'telegram',
  'viber',
  'wechat',
  'qq',
  'gsa/',
] as const;

/**
 * Regular expressions for browser detection
 */
export const REGEX_PATTERNS = {
  MOBILE: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i,
  ANDROID: /android/i,
  IOS: /iphone|ipad|ipod/i,
  SAFARI: /safari/i,
  CHROME: /chrome/i,
  CRIOS: /crios/i,
  WV_TOKEN: /\bwv\b/i,
  GSA_TOKEN: /gsa\//i,
  EDGE: /edg/i,
  FIREFOX: /firefox/i,
  OPERA: /opera|opr\//i,
  DUCKDUCKGO: /duckduckgo|ddg\//i,
  BRAVE: /brave/i,
  VIVALDI: /vivaldi/i,
  ANDROID_APP_REFERRER: /^android-app:\/\//i,
  GMAIL_REFERRER: /android-app:\/\/com\.google\.android\.gm|mail\.google\.com/i,
  VERSION_PATTERN: /version\/[\d.]+/i,
  CHROME_PATTERN: /chrome\/[\d.]+/i,
  IOS_VERSION_PATTERNS: {
    CPU_IPHONE_OS: /cpu\s+iphone\s+os\s+([\d_]+)/i,
    CPU_OS_LIKE_MAC: /cpu\s+os\s+([\d_]+)\s+like\s+mac\s+os\s+x/i,
    IPHONE_OS: /iphone\s+os\s+([\d_]+)/i,
    OS_LIKE_MAC: /(?:^|[^a-z])os\s+([\d_]+)\s+like\s+mac/i,
    PARENTHESES_OS_LIKE_MAC: /\([^)]*os\s+([\d_]+)\s+like\s+mac[^)]*\)/i,
    PARENTHESES_OS: /\([^)]*;\s*os\s+([\d_]+)\s+[^)]*\)/i,
  },
  BROWSER_VERSION: {
    CHROME: /(?:chrome|crios|edg)\/([\d.]+)/i,
    FIREFOX: /firefox\/([\d.]+)/i,
    SAFARI: /version\/([\d.]+)/i,
    EDGE: /edg\/([\d.]+)/i,
    OPERA: /(?:opera|opr)\/([\d.]+)/i,
    CHROME_VERSION: /chrome\/([\d.]+)/i,
  },
} as const;

/**
 * Thresholds for browser UI detection
 */
export const BROWSER_UI_THRESHOLDS = {
  OUTER_DIFF: 30,
  SCREEN_DIFF: 50,
  SMALL_VIEWPORT: 400,
} as const;

/**
 * Browser name mappings
 */
export const BROWSER_NAME_MAP = {
  GSA: 'Google App',
  FBAN: 'Facebook',
  FBAV: 'Facebook',
  TWITTER: 'Twitter',
  INSTAGRAM: 'Instagram',
  LINKEDINAPP: 'LinkedIn',
  SNAPCHAT: 'Snapchat',
  WHATSAPP: 'WhatsApp',
  LINE: 'Line',
  DISCORD: 'Discord',
  TELEGRAM: 'Telegram',
  VIBER: 'Viber',
  WECHAT: 'WeChat',
  QQ: 'QQ',
  GMAIL: 'Gmail',
  WEBVIEW: 'WebView',
  UNKNOWN: 'Unknown Browser',
} as const;

