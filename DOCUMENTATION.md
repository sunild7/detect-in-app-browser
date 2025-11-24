# detect-in-app-browser - Complete Documentation

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [What This Library Solves](#what-this-library-solves)
3. [How Detection Works](#how-detection-works)
4. [Installation](#installation)
5. [Usage Guide](#usage-guide)
6. [API Reference](#api-reference)
7. [Detection Methods Explained](#detection-methods-explained)
8. [Supported Email Providers](#supported-email-providers)
9. [Examples](#examples)
10. [Browser Compatibility](#browser-compatibility)
11. [Troubleshooting](#troubleshooting)

---

## Problem Statement

### The In-App Browser Problem

When users click links in email apps (like Gmail, Outlook, Yahoo Mail) or social media apps (Facebook, Instagram, Twitter), these apps often open the link in an **in-app browser** (also called a WebView) instead of the user's default browser.

### Why This Is a Problem

1. **Limited Functionality**: In-app browsers often have restrictions:
   - No access to browser extensions
   - Limited JavaScript APIs
   - Restricted cookie handling
   - No password manager integration
   - Limited file download capabilities

2. **User Experience Issues**:
   - Users may lose their session when switching between the email app and the website
   - OTP (One-Time Password) verification can fail because the user needs to switch back to the email app
   - Some features may not work as expected
   - Users may not realize they're in an in-app browser

3. **Security Concerns**:
   - In-app browsers may have different security policies
   - Some authentication flows may not work correctly
   - Session management can be problematic

### Real-World Scenario

Imagine a user receives an email with a link to your website. They click it:

1. **Gmail app** opens the link in its in-app browser
2. User tries to log in and needs an OTP
3. OTP is sent to their email
4. User switches back to Gmail to get the OTP
5. **Problem**: When they return, they may have lost their session or the page may have reloaded
6. User has to start over, creating frustration

---

## What This Library Solves

This library helps you:

1. **Detect** when users are viewing your site in an in-app browser
2. **Prompt** users to open the link in their default browser
3. **Improve** user experience by guiding them to the best browsing experience
4. **Prevent** session loss and authentication issues
5. **Track** analytics about in-app browser usage

### Key Benefits

- ✅ **Lightweight**: Uses battle-tested [Bowser](https://www.npmjs.com/package/bowser) for user-agent parsing
- ✅ **Accurate**: Multiple detection methods for reliable results
- ✅ **Email-Focused**: Specifically tuned for email provider in-app browsers
- ✅ **TypeScript**: Full type safety and IntelliSense support
- ✅ **Framework Agnostic**: Works with any JavaScript framework or vanilla JS

---

## How Detection Works

The library uses a **multi-layered detection approach** to accurately identify in-app browsers:

### Detection Flow

```
1. Check Referrer (First Priority)
   ↓
   If referrer matches known email provider → Return TRUE
   
2. Check Platform Type (via Bowser)
   ↓
   If desktop → Return FALSE (in-app browsers are mobile/tablet only)
   
3. Check User Agent Tokens
   ↓
   If UA contains known in-app tokens → Return TRUE
   
4. Check WebView Tokens
   ↓
   If UA contains WebView indicators → Return TRUE
   
5. Default → Return FALSE
```

### Detection Methods

#### 1. Referrer-Based Detection (Most Reliable)

The library checks `document.referrer` for known email provider patterns:

**Android App Referrers:**
- `android-app://com.google.android.gm` (Gmail)
- `android-app://com.microsoft.office.outlook` (Outlook)
- `android-app://com.yahoo.mobile.client.android.mail` (Yahoo Mail)
- And many more...

**Web Referrers:**
- `mail.google.com`
- `outlook.live.com`
- `mail.yahoo.com`
- And many more...

**Why This Works:**
When an email app opens a link, it often sets a specific referrer that identifies the source app. This is the most reliable method because it directly indicates the source.

#### 2. User Agent Token Detection

The library searches the user agent string for known in-app browser tokens:

**Generic Tokens:**
- `gsa/` - Google Search App
- `wv` - WebView indicator

**Email Provider Tokens:**
- `gmail`, `com.google.android.gm` - Gmail
- `outlook`, `com.microsoft.office.outlook` - Outlook
- `yahoo mail`, `ymail` - Yahoo Mail
- And many more...

**How It Works:**
Many in-app browsers include specific identifiers in their user agent string that distinguish them from regular browsers.

#### 3. WebView Token Detection

The library checks for WebView-specific patterns:
- ` wv` (space + wv)
- `; wv` (semicolon + wv)
- `_wv` (underscore + wv)
- `webview`
- `crosswalk`

**Why This Matters:**
WebViews are the underlying technology used by most in-app browsers. Detecting these tokens helps identify WebView-based browsers.

#### 4. Platform Type Filtering

The library uses [Bowser](https://www.npmjs.com/package/bowser) to determine the platform type:
- **Desktop**: Always returns `false` (in-app browsers are mobile/tablet only)
- **Mobile/Tablet**: Proceeds with other detection methods

**Why This Helps:**
This prevents false positives on desktop browsers, which don't have in-app browsers in the same way.

---

## Installation

### Option 1: NPM (Recommended)

```bash
npm install detect-in-app-browser
```

### Option 2: Direct Download

1. Download or clone this repository
2. Copy the `dist/` directory to your project
3. Import from the local path

### Option 3: CDN (For Browser Use)

When using directly in the browser without a bundler, you need to provide an import map:

```html
<script type="importmap">
  {
    "imports": {
      "bowser": "https://cdn.jsdelivr.net/npm/bowser@2.12.1/src/bowser.js"
    }
  }
</script>
<script type="module">
  import { InAppBrowserDetector } from './dist/index.js';
  // Your code here
</script>
```

---

## Usage Guide

### Basic Detection

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

// Simple detection
const isInApp = InAppBrowserDetector.detectInAppBrowser();

if (isInApp) {
  console.log('User is in an in-app browser!');
  // Show warning or redirect
}
```

### Get Environment Information

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

// Get detailed environment info
const environment = InAppBrowserDetector.getEnvironmentInfo();

console.log(environment);
// {
//   browserName: "Chrome",
//   browserVersion: "120.0.0",
//   osName: "Android",
//   osVersion: "13.0",
//   platformType: "mobile"
// }
```

### Get Browser Name Only

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

const browserName = InAppBrowserDetector.getBrowserName();
console.log(browserName); // "Chrome", "Safari", "Gmail", etc.
```

### Server-Side Detection (Testing)

You can override the user agent and referrer for testing:

```javascript
// Simulate Gmail in-app browser
const isInApp = InAppBrowserDetector.detectInAppBrowser(
  'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/91.0.4472.120 Mobile Safari/537.36',
  'android-app://com.google.android.gm'
);

console.log(isInApp); // true
```

---

## API Reference

### `InAppBrowserDetector.detectInAppBrowser(userAgentOverride?, referrerOverride?)`

Detects if the current browser is an in-app browser.

**Parameters:**
- `userAgentOverride` (optional): Override the user agent string for testing
- `referrerOverride` (optional): Override the referrer for testing

**Returns:** `boolean` - `true` if in-app browser is detected, `false` otherwise

**Example:**
```javascript
const isInApp = InAppBrowserDetector.detectInAppBrowser();
```

---

### `InAppBrowserDetector.getEnvironmentInfo(userAgentOverride?)`

Returns detailed environment information parsed via Bowser.

**Parameters:**
- `userAgentOverride` (optional): Override the user agent string for testing

**Returns:** `EnvironmentInfo` object:
```typescript
{
  browserName: string;        // e.g., "Chrome", "Safari"
  browserVersion: string;      // e.g., "120.0.0"
  osName: string;              // e.g., "Android", "iOS"
  osVersion: string;           // e.g., "13.0"
  platformType: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'wearable' | 'embedded' | 'console' | 'unknown';
}
```

**Example:**
```javascript
const env = InAppBrowserDetector.getEnvironmentInfo();
console.log(`Running on ${env.osName} ${env.osVersion}`);
```

---

### `InAppBrowserDetector.getBrowserName(userAgentOverride?)`

Convenience method to get just the browser name.

**Parameters:**
- `userAgentOverride` (optional): Override the user agent string for testing

**Returns:** `string` - Browser name or `"Unknown Browser"`

**Example:**
```javascript
const browser = InAppBrowserDetector.getBrowserName();
```

---

### `InAppBrowserDetector.getCurrentPageUrl()`

Gets the current page URL.

**Returns:** `string` - Current URL or empty string if unavailable

**Example:**
```javascript
const url = InAppBrowserDetector.getCurrentPageUrl();
console.log(url); // "https://example.com/page"
```

---

## Detection Methods Explained

### Method 1: Referrer Detection (Primary Method)

**How it works:**
1. Checks `document.referrer` for known email provider patterns
2. Matches against `REFERRER_PREFIXES` (Android app package IDs)
3. Matches against `REFERRER_HOSTS` (web email domains)

**Why it's reliable:**
- Directly indicates the source app
- Email apps consistently set these referrers
- Works even when user agent is generic

**Example referrers:**
- `android-app://com.google.android.gm` → Gmail Android app
- `mail.google.com` → Gmail web
- `outlook.live.com` → Outlook web

### Method 2: User Agent Token Detection

**How it works:**
1. Normalizes user agent to lowercase
2. Searches for tokens in `IN_APP_TOKENS` array
3. Returns `true` if any token is found

**Tokens checked:**
- Generic: `gsa/`, `wv`
- Gmail: `gmail`, `com.google.android.gm`, `googlemail`
- Outlook: `outlook`, `hotmail`, `com.microsoft.office.outlook`
- And many more email providers...

**Limitations:**
- Some in-app browsers may not include these tokens
- User agents can be spoofed (though rare in practice)

### Method 3: WebView Token Detection

**How it works:**
1. Searches for WebView-specific patterns in user agent
2. Patterns: ` wv`, `; wv`, `_wv`, `webview`, `crosswalk`

**Why it helps:**
- WebViews are the underlying technology for most in-app browsers
- These tokens are often present even when app-specific tokens aren't

### Method 4: Platform Type Filtering

**How it works:**
1. Uses Bowser to parse platform type
2. Desktop platforms → immediately return `false`
3. Mobile/tablet platforms → continue with other checks

**Why it's important:**
- Prevents false positives on desktop
- In-app browsers are primarily a mobile/tablet concern

---

## Supported Email Providers

The library detects in-app browsers from these email providers:

### Major Providers
- ✅ **Gmail** (Google)
- ✅ **Outlook** (Microsoft)
- ✅ **Yahoo Mail**
- ✅ **iCloud Mail** (Apple)

### Privacy-Focused
- ✅ **Proton Mail**
- ✅ **Fastmail**
- ✅ **Hey**

### Enterprise
- ✅ **Zoho Mail**
- ✅ **Microsoft 365** (Office 365)

### Regional
- ✅ **Yandex Mail** (Russia)
- ✅ **Mail.ru** (Russia)
- ✅ **AOL Mail**

### Third-Party Clients
- ✅ **Spark Mail**
- ✅ **BlueMail / TypeApp**
- ✅ **K-9 Mail**
- ✅ **Thunderbird**

### Detection Coverage

Each provider is detected through:
1. **Android App Package IDs** (referrer prefixes)
2. **Web Domain Names** (referrer hosts)
3. **User Agent Tokens** (UA string patterns)

---

## Examples

### Example 1: Show Warning Banner

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

if (InAppBrowserDetector.detectInAppBrowser()) {
  const banner = document.createElement('div');
  banner.innerHTML = `
    <strong>⚠️ In-App Browser Detected</strong><br>
    For the best experience, please open this page in your default browser.
    <br>
    <small>Long-press the URL and select "Open in Browser"</small>
  `;
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #ff6b6b;
    color: white;
    padding: 15px 20px;
    z-index: 10000;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  document.body.prepend(banner);
}
```

### Example 2: Conditional Feature Loading

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

const isInApp = InAppBrowserDetector.detectInAppBrowser();

// Disable features that don't work well in in-app browsers
const features = {
  advancedFeatures: !isInApp,
  pushNotifications: !isInApp,
  fileDownloads: !isInApp,
  passwordManager: !isInApp,
  browserExtensions: !isInApp,
};

if (features.advancedFeatures) {
  loadAdvancedFeatures();
}
```

### Example 3: Analytics Tracking

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

const environment = InAppBrowserDetector.getEnvironmentInfo();
const isInApp = InAppBrowserDetector.detectInAppBrowser();

// Track browser information
analytics.track('page_view', {
  browser: environment.browserName,
  browserVersion: environment.browserVersion,
  os: environment.osName,
  osVersion: environment.osVersion,
  platform: environment.platformType,
  isInAppBrowser: isInApp,
  referrer: document.referrer,
});
```

### Example 4: React Component

```jsx
import React, { useEffect, useState } from 'react';
import { InAppBrowserDetector } from 'detect-in-app-browser';

function App() {
  const [isInApp, setIsInApp] = useState(false);
  const [environment, setEnvironment] = useState(null);

  useEffect(() => {
    setIsInApp(InAppBrowserDetector.detectInAppBrowser());
    setEnvironment(InAppBrowserDetector.getEnvironmentInfo());
  }, []);

  return (
    <div>
      {isInApp && (
        <div className="warning-banner">
          <h3>⚠️ In-App Browser Detected</h3>
          <p>
            You're viewing this in {environment?.browserName}'s in-app browser.
            For the best experience, please open in your default browser.
          </p>
        </div>
      )}
      <main>
        {/* Your app content */}
      </main>
    </div>
  );
}
```

### Example 5: Vue.js Component

```vue
<template>
  <div>
    <div v-if="isInApp" class="warning-banner">
      <h3>⚠️ In-App Browser Detected</h3>
      <p>Please open this page in your default browser.</p>
    </div>
    <main>
      <!-- Your app content -->
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { InAppBrowserDetector } from 'detect-in-app-browser';

const isInApp = ref(false);
const environment = ref(null);

onMounted(() => {
  isInApp.value = InAppBrowserDetector.detectInAppBrowser();
  environment.value = InAppBrowserDetector.getEnvironmentInfo();
});
</script>
```

### Example 6: Redirect to Default Browser (iOS)

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

const environment = InAppBrowserDetector.getEnvironmentInfo();
const isInApp = InAppBrowserDetector.detectInAppBrowser();

if (isInApp && (environment.osName === 'iOS' || environment.osName === 'iPadOS')) {
  // On iOS, show instructions since we can't programmatically open default browser
  const message = `
    To continue, please:
    1. Tap the share button (square with arrow)
    2. Select "Safari" or your preferred browser
  `;
  alert(message);
}
```

---

## Browser Compatibility

### Supported Environments

- ✅ **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- ✅ **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- ✅ **Node.js**: ≥ 16.0.0 (for server-side testing)
- ✅ **ES Modules**: Required for browser usage

### Detection Accuracy

- **Email Apps**: ~95% accuracy (referrer-based detection is very reliable)
- **Social Media Apps**: Variable (depends on user agent tokens)
- **Desktop**: 100% accuracy (always returns `false` correctly)

### Limitations

1. **User Agent Spoofing**: Users can spoof user agents (rare in practice)
2. **New Email Apps**: New email providers may not be detected until added
3. **Privacy Modes**: Some privacy features may affect referrer detection
4. **iOS Restrictions**: Cannot programmatically open default browser on iOS

---

## Troubleshooting

### Issue: Detection Not Working

**Possible Causes:**
1. Missing import map (when using in browser without bundler)
2. User agent not being passed correctly
3. New email provider not yet supported

**Solutions:**
1. Ensure import map is present in HTML:
   ```html
   <script type="importmap">
     {
       "imports": {
         "bowser": "https://cdn.jsdelivr.net/npm/bowser@2.12.1/src/bowser.js"
       }
     }
   </script>
   ```
2. Check browser console for errors
3. Test with `userAgentOverride` parameter
4. Report new email providers via GitHub issues

### Issue: False Positives

**Possible Causes:**
1. Regular browser with similar user agent
2. Custom browser configurations

**Solutions:**
1. Check the detected environment info:
   ```javascript
   const env = InAppBrowserDetector.getEnvironmentInfo();
   console.log(env);
   ```
2. Verify referrer value:
   ```javascript
   console.log(document.referrer);
   ```
3. Report false positives via GitHub issues

### Issue: False Negatives

**Possible Causes:**
1. New email provider not yet in detection list
2. Email app using unusual user agent format
3. Referrer not being set by email app

**Solutions:**
1. Check user agent and referrer manually
2. Report new email providers via GitHub issues
3. Consider using `userAgentOverride` for testing

---

## Contributing

Found a new email provider that should be detected? Open an issue or pull request!

1. Fork the repository
2. Add the email provider to the detection lists
3. Test with real user agents
4. Submit a pull request

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/sunild7/detect-in-app-browser/issues)
- **Documentation**: This file and [README.md](./README.md)
- **Examples**: See `examples/basic/` directory

---

**Last Updated**: 2024

