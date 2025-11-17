# Quick Start Guide

Get started with `detect-in-app-browser` in 5 minutes!

## Step 1: Install

```bash
npm install detect-in-app-browser
```

Or download/copy the `dist/` folder (compiled files) directly into your project.

## Step 2: Import

```javascript
import { InAppBrowserDetector } from 'detect-in-app-browser';
```

Or if using local files:

```javascript
import { InAppBrowserDetector } from './dist/index.js';
```

> **Browser-only setup:** when you load `dist/index.js` directly in the browser (without a bundler), add an import map so the `bowser` dependency can be resolved:
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
const environment = InAppBrowserDetector.getEnvironmentInfo();
console.log(environment.osName, environment.browserName);
```

## Complete Example (no CSS required)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>My App</title>
</head>
<body>
  <h1>My App</h1>
  <div id="status"></div>

  <script type="module">
    import { InAppBrowserDetector } from './dist/index.js';
    
    const isInApp = InAppBrowserDetector.detectInAppBrowser();
    const environment = InAppBrowserDetector.getEnvironmentInfo();
    
    const statusDiv = document.getElementById('status');
    if (isInApp) {
      statusDiv.innerHTML = `
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px;">
          ⚠️ You're viewing this in ${environment.browserName}'s in-app browser.
          Please open in your system browser for the best experience.
        </div>
      `;
    } else {
      statusDiv.innerHTML = `
        <div style="background: #d4edda; padding: 15px; border-radius: 5px;">
          ✓ Regular browser detected (${environment.browserName} on ${environment.osName})
        </div>
      `;
    }
  </script>
</body>
</html>
```

## That's It!

You're ready to use the library. Check out the [examples](./examples/basic/) for more advanced usage.

To run the examples locally from the project root:

```bash
python3 -m http.server 8000
# then open, for example:
# http://localhost:8000/examples/basic/example1-es-module.html
```

## Next Steps

- Read the [README.md](./README.md) for complete API documentation
- Check [USAGE.md](./USAGE.md) for real-world examples
- See [examples/basic/](./examples/basic/) for working examples

