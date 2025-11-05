# Quick Start Guide

Get started with `detect-in-app-browser` in 5 minutes!

## Step 1: Install

```bash
npm install detect-in-app-browser
```

Or download the `lib/` folder directly.

## Step 2: Import

```javascript
import { InAppBrowserDetector, PlatformUtils } from 'detect-in-app-browser';
```

Or if using local files:

```javascript
import { InAppBrowserDetector, PlatformUtils } from './lib/index.js';
```

## Step 3: Use

### Detect In-App Browser

```javascript
if (InAppBrowserDetector.detectInAppBrowser()) {
  console.log('In-app browser detected!');
}
```

### Get Browser Name

```javascript
const browserName = InAppBrowserDetector.getBrowserName();
console.log('Browser:', browserName);
```

### Get Platform Info

```javascript
const isMobile = PlatformUtils.isMobile();
const os = PlatformUtils.getOS();
const osVersion = PlatformUtils.getOSVersion();
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <h1>My App</h1>
  <div id="status"></div>

  <script type="module">
    import { InAppBrowserDetector, PlatformUtils } from './lib/index.js';
    
    // Detect in-app browser
    const isInApp = InAppBrowserDetector.detectInAppBrowser();
    const browserName = InAppBrowserDetector.getBrowserName();
    
    // Get platform info
    const os = PlatformUtils.getOS();
    const isMobile = PlatformUtils.isMobile();
    
    // Display status
    const statusDiv = document.getElementById('status');
    if (isInApp) {
      statusDiv.innerHTML = `
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px;">
          ⚠️ You're viewing this in ${browserName}'s in-app browser.
          Please open in your system browser for the best experience.
        </div>
      `;
    } else {
      statusDiv.innerHTML = `
        <div style="background: #d4edda; padding: 15px; border-radius: 5px;">
          ✓ Regular browser detected (${browserName} on ${os})
        </div>
      `;
    }
  </script>
</body>
</html>
```

## That's It!

You're ready to use the library. Check out the [examples](./examples/basic/) for more advanced usage.

## Next Steps

- Read the [README.md](./README.md) for complete API documentation
- Check [USAGE.md](./USAGE.md) for real-world examples
- See [examples/basic/](./examples/basic/) for working examples

