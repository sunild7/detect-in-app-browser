# Usage Guide

This guide shows you how to use the `detect-in-app-browser` library in your web applications.

## Installation

### Option 1: NPM (Recommended)

```bash
npm install detect-in-app-browser
```

Then import in your code:

```javascript
import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';
```

### Option 2: Direct Download

1. Copy the `dist/` folder (compiled files) into your project
2. Import directly from it:

```javascript
import { InAppBrowserDetector, PlatformUtils } from './dist/index.js';
```

## Basic Usage

### 1. Detect In-App Browser

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

// Simple detection
if (InAppBrowserDetector.detectInAppBrowser()) {
  console.log('In-app browser detected!');
  // Show warning to user
  alert('Please open in your system browser for better experience');
}
```

### 2. Get Browser Name

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';

const browserName = InAppBrowserDetector.getBrowserName();
console.log('Browser:', browserName); // 'Chrome', 'Safari', 'Facebook', 'Gmail', etc.
```

### 3. Get Platform Information

```javascript
import { PlatformUtils } from 'detect-in-app-browser';

// Check device type
const isMobile = PlatformUtils.isMobile();
const isAndroid = PlatformUtils.isAndroid();
const isIOS = PlatformUtils.isIOS();

// Get OS information
const os = PlatformUtils.getOS(); // 'Android', 'iOS', 'Windows', etc.
const osVersion = PlatformUtils.getOSVersion(); // '13.0', '18.7', etc.

// Get browser version
const browserVersion = PlatformUtils.getBrowserVersion();
```

## Real-World Examples

### Example 1: Show Warning Banner (no CSS required)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <div id="warning-banner" style="display:none;position:fixed;top:0;left:0;right:0;background:#ff6b6b;color:#fff;padding:12px 16px;font:14px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;z-index:10000;">
    ⚠️ You're viewing this in an in-app browser. Please open in your system browser for the best experience.
  </div>

  <script type="module">
    import { InAppBrowserDetector } from './lib/index.js';
    
    if (InAppBrowserDetector.detectInAppBrowser()) {
      document.getElementById('warning-banner').style.display = 'block';
    }
  </script>
</body>
</html>
```

### Example 2: Conditional Feature Loading

```javascript
import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';

const isInApp = InAppBrowserDetector.detectInAppBrowser();
const isMobile = PlatformUtils.isMobile();

// Load features based on browser
if (!isInApp) {
  // Load advanced features only in regular browsers
  loadAdvancedFeatures();
}

if (!isInApp && isMobile) {
  // Enable push notifications only in regular mobile browsers
  enablePushNotifications();
}
```

### Example 3: Analytics Tracking

```javascript
import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';

// Track browser information
const browserInfo = {
  browser: InAppBrowserDetector.getBrowserName(),
  browserVersion: PlatformUtils.getBrowserVersion(),
  os: PlatformUtils.getOS(),
  osVersion: PlatformUtils.getOSVersion(),
  isInApp: InAppBrowserDetector.detectInAppBrowser(),
  isMobile: PlatformUtils.isMobile(),
};

// Send to analytics
analytics.track('page_view', browserInfo);
```

### Example 4: Show Different UI

```javascript
import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';

function initializeUI() {
  const isInApp = InAppBrowserDetector.detectInAppBrowser();
  const browserName = InAppBrowserDetector.getBrowserName();
  
  if (isInApp) {
    // Show simplified UI for in-app browsers
    showSimplifiedUI();
    showOpenInBrowserButton();
  } else {
    // Show full UI for regular browsers
    showFullUI();
  }
}

function showOpenInBrowserButton() {
  const button = document.createElement('button');
  button.textContent = 'Open in System Browser';
  button.onclick = () => {
    // Open current URL in system browser
    window.open(window.location.href, '_system');
  };
  document.body.appendChild(button);
}
```

### Example 5: React Component

```jsx
import React, { useEffect, useState } from 'react';
import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';

function App() {
  const [isInApp, setIsInApp] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({});

  useEffect(() => {
    setIsInApp(InAppBrowserDetector.detectInAppBrowser());
    setBrowserInfo({
      browser: InAppBrowserDetector.getBrowserName(),
      os: PlatformUtils.getOS(),
      isMobile: PlatformUtils.isMobile(),
    });
  }, []);

  return (
    <div>
      {isInApp && (
        <div className="warning-banner">
          ⚠️ You're viewing this in an in-app browser. 
          Please open in your system browser.
        </div>
      )}
      <main>
        {/* Your app content */}
      </main>
    </div>
  );
}
```

### Example 6: Vue.js Component

```vue
<template>
  <div>
    <div v-if="isInApp" class="warning-banner">
      ⚠️ In-app browser detected. Please open in system browser.
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

onMounted(() => {
  isInApp.value = InAppBrowserDetector.detectInAppBrowser();
});
</script>
```

## API Reference

See the main [README.md](./README.md) for complete API documentation.

## Tips

1. **Always check for in-app browsers** before loading heavy features
2. **Show warnings early** - detect as soon as the page loads
3. **Provide alternatives** - offer users a way to open in system browser
4. **Track analytics** - log in-app browser usage for insights
5. **Test thoroughly** - test in actual in-app browsers (Facebook, Gmail, etc.)

## Browser Support

- Modern browsers with ES6 module support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Need Help?

- Check the [examples](./examples/basic/) directory
- See the [README.md](./README.md) for API reference
- Open an issue on [GitHub](https://github.com/sunild7/detect-in-app-browser/issues)

