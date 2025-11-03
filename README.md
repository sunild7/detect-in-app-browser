# In-App Browser Detection & System Browser Opener

A modular JavaScript application that detects in-app browsers and provides functionality to open URLs in the system/default browser.

## Project Structure

```
detect-in-app-browser/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All CSS styles
├── js/
│   ├── main.js            # Application entry point
│   ├── InAppBrowserDetector.js   # Browser detection logic
│   ├── SystemBrowserOpener.js    # System browser opening logic
│   ├── AppController.js          # Main application controller
│   └── utils/
│       ├── platform.js           # Platform detection utilities
│       └── testHelpers.js        # Test utility functions
└── README.md
```

## Module Descriptions

### Core Modules

- **`InAppBrowserDetector.js`**: Detects if the current browser is an in-app browser (WebView) or a regular browser. Supports detection of Facebook, Twitter, Instagram, Gmail, and other in-app browsers.

- **`SystemBrowserOpener.js`**: Handles opening URLs in the system/default browser using multiple methods:
  - Android Intent URIs (default browser and Chrome-specific)
  - `window.open()` with `'_system'` target
  - Anchor element clicks
  - Iframe-based approaches
  - Fallback instructions modal

- **`AppController.js`**: Main application controller that orchestrates detection, UI updates, and user interactions.

### Utility Modules

- **`utils/platform.js`**: Platform detection utilities (Android, iOS, Mobile, Desktop).

- **`utils/testHelpers.js`**: Helper functions for testing URL manipulation (adding/clearing test parameters and hash fragments).

### Entry Point

- **`main.js`**: Initializes the application, sets up event listeners, and exposes global functions for inline event handlers.

## Usage

Simply open `index.html` in a browser. The application will:
1. Detect if it's running in an in-app browser
2. Display a warning banner and floating button if in-app browser is detected
3. Provide functionality to open the current page in the system browser

## Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Android WebView / In-App Browsers
- ✅ iOS Safari / In-App Browsers

## Features

- 🎯 Accurate in-app browser detection
- 📱 Cross-platform support (Android & iOS)
- 🔄 Multiple fallback methods for opening in system browser
- 🎨 Modern, responsive UI
- 📦 Modular, maintainable code structure

## Technical Notes

- Uses ES6 modules (`type="module"` in script tag)
- Requires a modern web server to run (due to ES6 modules and CORS)
- Compatible with modern browsers that support ES6 modules

