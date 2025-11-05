# detect-in-app-browser

A simple JavaScript library to detect in-app browsers (WebView) and differentiate them from regular browsers. Supports detection of Facebook, Twitter, Instagram, Gmail, and other in-app browsers.

## Installation

### NPM

```bash
npm install detect-in-app-browser
```

### Direct Download

Download the library files from the `lib/` directory and include them in your project.

## Quick Start

### ES Module (Recommended)

```html
<script type="module">
  import { InAppBrowserDetector, PlatformUtils } from './lib/index.js';
  
  // Detect if in-app browser
  if (InAppBrowserDetector.detectInAppBrowser()) {
    console.log('In-app browser detected!');
  }
</script>
```

### Basic Usage

```javascript
import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';

// Detect in-app browser
const isInApp = InAppBrowserDetector.detectInAppBrowser();
const browserName = InAppBrowserDetector.getBrowserName();

// Get platform information
const isMobile = PlatformUtils.isMobile();
const os = PlatformUtils.getOS();
const osVersion = PlatformUtils.getOSVersion();
const browserVersion = PlatformUtils.getBrowserVersion();

// Show warning if in-app browser
if (isInApp) {
  alert(`You are in ${browserName}'s in-app browser. Consider opening in system browser.`);
}
```

## API Reference

### InAppBrowserDetector

#### `detectInAppBrowser()`

Detects if the current browser is an in-app browser (WebView).

**Returns:** `boolean` - `true` if in-app browser is detected, `false` otherwise.

**Example:**
```javascript
const isInApp = InAppBrowserDetector.detectInAppBrowser();
if (isInApp) {
  // Handle in-app browser case
}
```

#### `getBrowserName()`

Gets the name of the current browser.

**Returns:** `string` - Browser name (e.g., 'Chrome', 'Safari', 'Facebook', 'Gmail', 'WebView', etc.).

**Example:**
```javascript
const browserName = InAppBrowserDetector.getBrowserName();
console.log('Browser:', browserName);
```

#### `getCurrentPageUrl()`

Gets the current page URL.

**Returns:** `string` - Current page URL.

**Example:**
```javascript
const url = InAppBrowserDetector.getCurrentPageUrl();
console.log('Current URL:', url);
```

#### `detectGmailApp()`

Detects if the current browser is Gmail app's in-app browser.

**Returns:** `boolean` - `true` if Gmail app browser is detected.

**Example:**
```javascript
if (InAppBrowserDetector.detectGmailApp()) {
  console.log('Gmail app detected');
}
```

#### `detectWebView(userAgent)`

Detects WebView indicators from a user agent string.

**Parameters:**
- `userAgent` (string): Lowercase user agent string

**Returns:** `boolean` - `true` if WebView is detected.

### PlatformUtils

#### `isAndroid()`

Checks if the current device is Android.

**Returns:** `boolean`

**Example:**
```javascript
if (PlatformUtils.isAndroid()) {
  console.log('Android device');
}
```

#### `isIOS()`

Checks if the current device is iOS.

**Returns:** `boolean`

#### `isMobile()`

Checks if the current device is mobile.

**Returns:** `boolean`

#### `isDesktop()`

Checks if the current device is desktop.

**Returns:** `boolean`

#### `getOS()`

Gets the operating system name.

**Returns:** `string` - OS name (e.g., 'Android', 'iOS', 'Windows', 'macOS', etc.).

**Example:**
```javascript
const os = PlatformUtils.getOS();
console.log('OS:', os); // 'Android', 'iOS', 'Windows', etc.
```

#### `getOSVersion()`

Gets the operating system version.

**Returns:** `string` - OS version or 'Unknown'.

**Example:**
```javascript
const osVersion = PlatformUtils.getOSVersion();
console.log('OS Version:', osVersion); // '13.0', '18.7', etc.
```

#### `getBrowserVersion()`

Gets the browser version.

**Returns:** `string` - Browser version or 'Unknown'.

**Example:**
```javascript
const browserVersion = PlatformUtils.getBrowserVersion();
console.log('Browser Version:', browserVersion);
```

## Usage Examples

### Example 1: Show Warning for In-App Browsers

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

if (InAppBrowserDetector.detectInAppBrowser()) {
  const browserName = InAppBrowserDetector.getBrowserName();
  const warning = document.createElement('div');
  warning.innerHTML = `
    <strong>⚠️ In-App Browser Detected</strong><br>
    You are viewing this in ${browserName}'s in-app browser.
    For the best experience, please open in your system browser.
  `;
  document.body.prepend(warning);
}
```

### Example 2: Conditional Feature Availability

```javascript
import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';

const isInApp = InAppBrowserDetector.detectInAppBrowser();
const isMobile = PlatformUtils.isMobile();

// Enable/disable features based on browser
const features = {
  advancedFeatures: !isInApp,
  pushNotifications: !isInApp && isMobile,
  fileDownloads: !isInApp,
};
```

### Example 3: Get Platform Information

```javascript
import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';

const info = {
  browser: InAppBrowserDetector.getBrowserName(),
  browserVersion: PlatformUtils.getBrowserVersion(),
  os: PlatformUtils.getOS(),
  osVersion: PlatformUtils.getOSVersion(),
  deviceType: PlatformUtils.isMobile() ? 'Mobile' : 'Desktop',
  isInApp: InAppBrowserDetector.detectInAppBrowser(),
};

console.log('Platform Info:', info);
```

## Examples

See the `examples/basic/` directory for more usage examples:

- `example1-es-module.html` - Basic ES module usage
- `example2-simple-detection.html` - Simple detection with alerts
- `example3-conditional-logic.html` - Conditional feature availability
- `example4-platform-info.html` - Platform information display

## Supported Browsers

### In-App Browsers Detected:
- Facebook (fban, fbav)
- Twitter
- Instagram
- LinkedIn
- Gmail
- Google App (GSA)
- WhatsApp
- Snapchat
- Line
- Discord
- Telegram
- And more...

### Regular Browsers:
- Chrome
- Safari
- Firefox
- Edge
- Opera
- Brave
- DuckDuckGo
- Vivaldi

## Browser Compatibility

- Modern browsers with ES6 module support
- Chrome/Edge: Latest versions
- Firefox: Latest versions
- Safari: Latest versions
- Mobile browsers: iOS Safari, Chrome Mobile, etc.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please visit the [GitHub repository](https://github.com/sunild7/detect-in-app-browser).
