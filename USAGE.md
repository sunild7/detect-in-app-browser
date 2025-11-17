# Usage Guide

Learn how to get the most out of `detect-in-app-browser`.

## Installation

### Option 1: NPM (Recommended)

```bash
npm install detect-in-app-browser
```

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';
```

### Option 2: Direct Download

1. Copy the `dist/` folder into your project.
2. Import directly:

```javascript
import { InAppBrowserDetector } from './dist/index.js';
```

> **Using plain `<script type="module">`?** Add an import map so browsers know where to fetch Bowser:
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

## Core Patterns

### Detect in-app browsers

```javascript
if (InAppBrowserDetector.detectInAppBrowser()) {
  console.log('In-app browser detected');
}
```

### Read environment info (Bowser result)

```javascript
const environment = InAppBrowserDetector.getEnvironmentInfo();

console.table({
  Browser: `${environment.browserName} ${environment.browserVersion}`,
  OS: `${environment.osName} ${environment.osVersion}`,
  Platform: environment.platformType,
});
```

### Grab just the browser name

```javascript
const browser = InAppBrowserDetector.getBrowserName();
```

## Real-World Examples

### 1. Warning banner (no CSS needed)

```html
<div id="iab-warning" style="display:none;position:fixed;top:0;left:0;right:0;background:#ff6b6b;color:#fff;padding:12px 16px;z-index:1000;">
  ⚠️ In-app browser detected. Please open this page in your default browser.
</div>

<script type="module">
  import { InAppBrowserDetector } from './dist/index.js';

  if (InAppBrowserDetector.detectInAppBrowser()) {
    document.getElementById('iab-warning').style.display = 'block';
  }
</script>
```

### 2. Feature gating

```javascript
const isInApp = InAppBrowserDetector.detectInAppBrowser();

const features = {
  downloads: !isInApp,
  pushNotifications: !isInApp,
  advancedEditor: !isInApp,
};
```

### 3. Analytics payload

```javascript
const environment = InAppBrowserDetector.getEnvironmentInfo();

sendAnalytics({
  ...environment,
  isInApp: InAppBrowserDetector.detectInAppBrowser(),
});
```

### 4. React hook example

```jsx
import { useEffect, useState } from 'react';
import { InAppBrowserDetector } from 'detect-in-app-browser';

export function useInAppBrowser() {
  const [state, setState] = useState({ isInApp: false, environment: null });

  useEffect(() => {
    setState({
      isInApp: InAppBrowserDetector.detectInAppBrowser(),
      environment: InAppBrowserDetector.getEnvironmentInfo(),
    });
  }, []);

  return state;
}
```

### 5. Vue component

```vue
<template>
  <div v-if="isInApp" class="warning-banner">
    ⚠️ In-app browser detected.
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

## Tips

1. Detect immediately on page load so users see the warning right away.
2. Pair detection with `document.referrer` logging for support tickets.
3. Store the Bowser environment info for analytics or debugging.
4. When in doubt, provide a manual “Open in browser” instruction.

## Browser Support

- Any modern browser with ES modules
- Mobile Chrome/Safari/WebView on Android & iOS
- Works in Node ≥ 16 for SSR/testing (pass a user-agent string manually)

## Need Help?

- Explore the [examples](./examples/basic/) folder
- Read the [README.md](./README.md) for the full API
- File an issue on [GitHub](https://github.com/sunild7/detect-in-app-browser/issues)

