# detect-in-app-browser

A tiny TypeScript/JavaScript helper that tells you if visitors are stuck inside an in-app browser (WebView) and nudges them to open your site in a real browser. User‑agent parsing is handled by the battle-tested [`bowser`](https://www.npmjs.com/package/bowser) package—no fragile regexes to maintain.

## Installation

### NPM

```bash
npm install detect-in-app-browser
```

### Direct Download

Copy the `dist/` directory into your project and import from it:

```html
<script type="module">
  import { InAppBrowserDetector } from './dist/index.js';
  // Show your own UI — no CSS is bundled.
</script>
```

## Quick Start

```html
<script type="module">
  import { InAppBrowserDetector } from './dist/index.js';

  if (InAppBrowserDetector.detectInAppBrowser()) {
    console.log('In-app browser detected!');
  }
</script>
```

> **Heads up:** when loading the library directly in the browser (without a bundler) you must provide an import map for Bowser:
>
> ```html
> <script type="importmap">
>   {
>     "imports": {
>       "bowser": "https://cdn.jsdelivr.net/npm/bowser@2.12.1/src/bowser.js"
>     }
>   }
> </script>
> ```

## Basic Usage

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

const isInApp = InAppBrowserDetector.detectInAppBrowser();
const environment = InAppBrowserDetector.getEnvironmentInfo();

if (isInApp) {
  alert(`You are in ${environment.browserName}'s in-app browser. Please open this page in your default browser.`);
}
```

`environment` is powered by Bowser and contains:

```ts
{
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  platformType: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'wearable' | 'embedded' | 'console' | 'unknown';
}
```

## API Reference

### `InAppBrowserDetector.detectInAppBrowser(userAgentOverride?, referrerOverride?)`

Returns `true` when the current context looks like an in-app browser. Detection relies on:

- Known in-app user-agent tokens parsed via Bowser
- Referrer heuristics (`android-app://`, `mail.google.com`, etc.)

Both parameters are optional and useful for testing on the server.

### `InAppBrowserDetector.getEnvironmentInfo(userAgentOverride?)`

Returns the Bowser-powered environment object shown above so you can display the browser/OS details or feed analytics.

### `InAppBrowserDetector.getBrowserName(userAgentOverride?)`

Convenience wrapper that returns just the browser name string (falls back to `'Unknown Browser'`).

### `InAppBrowserDetector.getCurrentPageUrl()`

Returns `window.location.href` when available, otherwise an empty string.

## Usage Examples

### 1. Show a warning banner

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

if (InAppBrowserDetector.detectInAppBrowser()) {
  const banner = document.createElement('div');
  banner.innerHTML = `
    <strong>⚠️ In-App Browser Detected</strong><br>
    Long-press the URL and open in your default browser for the best experience.
  `;
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff6b6b;color:#fff;padding:12px 16px;z-index:10000;';
  document.body.prepend(banner);
}
```

### 2. Conditional feature loading

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

const isInApp = InAppBrowserDetector.detectInAppBrowser();

const features = {
  advancedFeatures: !isInApp,
  pushNotifications: !isInApp,
  fileDownloads: !isInApp,
};
```

### 3. Analytics payload

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

const environment = InAppBrowserDetector.getEnvironmentInfo();

analytics.track('page_view', {
  ...environment,
  isInApp: InAppBrowserDetector.detectInAppBrowser(),
});
```

## Examples

Working demos live under `examples/basic/` (serve the repo root, e.g. `python3 -m http.server 8000`):

- `example1-es-module.html` – minimal ES module usage
- `example2-simple-detection.html` – detection banner
- `example3-conditional-logic.html` – feature gating
- `example4-platform-info.html` – environment inspector

## Supported Browsers

The detector focuses on common in-app contexts such as Facebook, Instagram, Twitter/X, Gmail, Google App (GSA), WhatsApp, Snapchat, Line, Discord, Telegram, and other WebView-based shells. Regular browsers (Chrome, Safari, Firefox, Edge, Opera, etc.) are treated as non in-app.

## Browser Compatibility

- Modern browsers with ES modules
- Mobile Chrome/Safari/WebView on Android & iOS
- Node.js ≥ 16 for server-side rendering tests

## License

MIT – see [LICENSE](./LICENSE).

## Contributing

Issues and pull requests are very welcome. Open one at [GitHub](https://github.com/sunild7/detect-in-app-browser).*** End Patch
