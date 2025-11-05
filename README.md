# detect-in-app-browser

A TypeScript library to detect in-app browsers (WebView) and differentiate them from regular browsers. Supports detection of Facebook, Twitter, Instagram, Gmail, and other in-app browsers.

## Installation

```bash
npm install detect-in-app-browser
```

## Usage

### ES Module (TypeScript/JavaScript)

```typescript
import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';

// Detect if current browser is an in-app browser
const isInApp = InAppBrowserDetector.detectInAppBrowser();

// Get browser name
const browserName = InAppBrowserDetector.getBrowserName();

// Get platform information
const isMobile = PlatformUtils.isMobile();
const isAndroid = PlatformUtils.isAndroid();
const isIOS = PlatformUtils.isIOS();
const os = PlatformUtils.getOS();
const osVersion = PlatformUtils.getOSVersion();
const browserVersion = PlatformUtils.getBrowserVersion();

// Example: Show warning if in-app browser detected
if (isInApp) {
  console.warn(`Running in ${browserName}'s in-app browser`);
  // Show user a prompt to open in system browser
}
```

### JavaScript Example

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

if (InAppBrowserDetector.detectInAppBrowser()) {
  alert('You are in an in-app browser!');
}
```

## API Reference

### `InAppBrowserDetector`

Main class for detecting in-app browsers.

#### Static Methods

##### `detectInAppBrowser(): boolean`

Detects if the current browser is an in-app browser (WebView).

**Returns:** `true` if in-app browser is detected, `false` otherwise.

##### `getBrowserName(): BrowserName`

Gets the name of the current browser.

**Returns:** Browser name string (e.g., "Chrome", "Safari", "Gmail", "Facebook", "WebView", etc.)

##### `detectGmailApp(): boolean`

Specifically detects if running in Gmail's in-app browser.

**Returns:** `true` if Gmail app browser is detected, `false` otherwise.

##### `detectWebView(userAgent: string): boolean`

Detects WebView indicators from a user agent string.

**Parameters:**
- `userAgent` (string): Lowercase user agent string

**Returns:** `true` if WebView is detected, `false` otherwise.

##### `getCurrentPageUrl(): string`

Gets the current page URL.

**Returns:** Current page URL string.

##### `checkViewportBehavior(): boolean`

Checks for viewport behavior typical of in-app browsers.

**Returns:** `true` if viewport behavior suggests in-app browser, `false` otherwise.

### `PlatformUtils`

Utility class for platform and browser detection.

#### Static Methods

##### `isAndroid(): boolean`

Checks if the current device is Android.

##### `isIOS(): boolean`

Checks if the current device is iOS.

##### `isMobile(): boolean`

Checks if the current device is mobile.

##### `isDesktop(): boolean`

Checks if the current device is desktop.

##### `getOS(): OSName`

Gets the operating system name.

**Returns:** OS name string (e.g., "Android", "iOS", "Windows", "macOS", "Linux", etc.)

##### `getOSVersion(): string`

Gets the operating system version.

**Returns:** OS version string (e.g., "14.0", "10", "26.1", etc.)

##### `getBrowserVersion(): string`

Gets the browser version.

**Returns:** Browser version string (e.g., "120.0.0", "18.1", etc.)

## Supported In-App Browsers

The library detects the following in-app browsers:

- ✅ Facebook (fban, fbav)
- ✅ Twitter
- ✅ Instagram
- ✅ LinkedIn
- ✅ Gmail / Google App (GSA)
- ✅ WhatsApp
- ✅ Snapchat
- ✅ Pinterest
- ✅ Slack
- ✅ Discord
- ✅ Telegram
- ✅ Viber
- ✅ WeChat
- ✅ QQ
- ✅ Line
- ✅ Generic WebView

## Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Android WebView / In-App Browsers
- ✅ iOS Safari / In-App Browsers
- ✅ Brave
- ✅ DuckDuckGo
- ✅ Opera
- ✅ Vivaldi

## Features

- 🎯 Accurate in-app browser detection
- 📱 Cross-platform support (Android & iOS)
- 🔍 Multiple detection methods (user agent, referrer, viewport, etc.)
- 🚀 Zero dependencies
- 📦 TypeScript support with full type definitions
- 🎨 Works in browsers only (uses `navigator` and `window` APIs)

## Project Structure

```
detect-in-app-browser/
├── src/                      # TypeScript source files
│   ├── index.ts              # Main entry point
│   ├── InAppBrowserDetector.ts
│   ├── types.ts              # Type definitions
│   └── utils/
│       └── platform.ts
├── dist/                     # Compiled JavaScript (built)
├── examples/                 # Example implementations
│   ├── js/                   # TypeScript source
│   ├── js-compiled/          # Compiled JavaScript
│   ├── css/
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Building

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode
npm run watch
```

### Examples

See the `examples/` directory for complete example implementations.

```bash
# Build main package first
npm run build

# Then build examples
cd examples
npm install
npm run build

# Serve examples
python3 -m http.server 8000
```

## TypeScript

This package is written in TypeScript and includes full type definitions. Types are automatically included when you install the package.

```typescript
import type { BrowserName, OSName } from 'detect-in-app-browser';

const browserName: BrowserName = InAppBrowserDetector.getBrowserName();
const osName: OSName = PlatformUtils.getOS();
```

## Technical Notes

- Uses ES6 modules (`type="module"` in script tag)
- Requires a modern web server to run examples (due to ES6 modules and CORS)
- Compatible with modern browsers that support ES6 modules
- Browser-only library (uses `navigator` and `window` APIs, not compatible with Node.js)

## Publishing

This package is published to npm. To publish a new version:

```bash
# Update version
npm version patch|minor|major

# Build
npm run build

# Publish
npm publish
```

See [PUBLISHING.md](./PUBLISHING.md) for detailed publishing instructions.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
