# Examples

This directory contains example implementations that demonstrate how to use the `detect-in-app-browser` npm package.

## 📁 Structure

```
examples/
├── js/                      # TypeScript source files
│   ├── main.ts             # Application entry point
│   ├── AppController.ts    # Main application controller
│   └── utils/              # Utility modules
│       ├── clipboard.ts    # Clipboard utilities
│       └── ui.ts           # UI utilities
├── js-compiled/            # Compiled JavaScript (after build)
├── css/                    # Stylesheets
├── index.html              # Demo page
├── package.json            # Example dependencies
├── tsconfig.json           # TypeScript config for examples
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Build the main package

From the project root:

```bash
npm install
npm run build
```

This creates the `dist/` directory with compiled JavaScript and type definitions.

### 2. Build the examples

From the examples directory:

```bash
cd examples
npm install
npm run build
```

This compiles the TypeScript files in `js/` to JavaScript in `js-compiled/`.

### 3. Serve the examples

**Important:** Serve from the **project root**, not from the examples directory.

```bash
# From project root
cd /Users/sunil/Work/Projects/detect-in-app-browser
python3 -m http.server 3344
# OR
npx http-server . -p 3344
```

### 4. Open in browser

```
http://localhost:3344/examples/index.html
```

## 🔧 Development

### Watch mode

To automatically rebuild when files change:

```bash
cd examples
npm run watch
```

### Code Structure

The example demonstrates:

- **AppController** - Main controller that uses the package API
- **Utilities** - Helper modules for clipboard and UI operations
- **Error Handling** - Proper error handling and fallbacks
- **TypeScript** - Full TypeScript support with proper types

### Key Features Demonstrated

1. ✅ **Detection** - Detecting in-app browsers vs regular browsers
2. ✅ **Platform Info** - Getting OS, browser version, etc.
3. ✅ **UI Updates** - Dynamic UI updates based on detection
4. ✅ **Error Handling** - Graceful error handling
5. ✅ **Type Safety** - Full TypeScript support

## 📝 Code Example

```typescript
import { InAppBrowserDetector, PlatformUtils } from '../../dist/index.js';

// Detect in-app browser
const isInApp = InAppBrowserDetector.detectInAppBrowser();

// Get browser name
const browserName = InAppBrowserDetector.getBrowserName();

// Get platform information
const isMobile = PlatformUtils.isMobile();
const os = PlatformUtils.getOS();
const osVersion = PlatformUtils.getOSVersion();
```

## 🐛 Troubleshooting

### Module not found errors

- Make sure you've built the main package: `npm run build` (from project root)
- Make sure you've built the examples: `cd examples && npm run build`
- Make sure you're serving from the **project root**, not from examples directory

### 404 errors

- Check that `dist/` directory exists in project root
- Check that `js-compiled/` directory exists in examples
- Verify the server is running from project root

## 📚 Learn More

See the main [README.md](../README.md) for complete API documentation and usage examples.
