# Examples Setup Guide

## Quick Start

1. **Build the main package** (from project root):
   ```bash
   cd /Users/sunil/Work/Projects/detect-in-app-browser
   npm install
   npm run build
   ```

2. **Build the examples** (from examples directory):
   ```bash
   cd examples
   npm install
   npm run build
   ```

3. **Serve from project root** (IMPORTANT: Serve from project root, not from examples directory):
   ```bash
   # From project root
   cd /Users/sunil/Work/Projects/detect-in-app-browser
   python3 -m http.server 3344
   # OR
   npx http-server . -p 3344
   ```

4. **Open in browser**:
   ```
   http://localhost:3344/examples/index.html
   ```

## Why serve from project root?

The examples import from `../../dist/index.js`, which means:
- `examples/js-compiled/main.js` imports `../../dist/index.js`
- This resolves to `dist/index.js` relative to the project root
- Therefore, the server must run from the project root for the paths to resolve correctly

## Alternative: Serve from examples directory

If you want to serve from the examples directory, you need to copy or symlink the `dist` folder:

```bash
cd examples
ln -s ../dist dist
python3 -m http.server 3344
# Then open: http://localhost:3344/index.html
```

