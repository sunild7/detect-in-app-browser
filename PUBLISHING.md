# Publishing Guide

This guide explains how to publish the `detect-in-app-browser` package to npm.

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **Login**: Run `npm login` to authenticate
3. **Git Repository**: Ensure your repository is pushed to GitHub

## Pre-Publishing Checklist

### 1. Update Version

Update the version in `package.json`:

```bash
# For patch version (1.0.0 -> 1.0.1)
npm version patch

# For minor version (1.0.0 -> 1.1.0)
npm version minor

# For major version (1.0.0 -> 2.0.0)
npm version major
```

Or manually edit `package.json`:

```json
{
  "version": "1.0.0"
}
```

### 2. Update Repository Information

Ensure the repository URL in `package.json` is correct:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/sunild7/detect-in-app-browser.git"
  }
}
```

### 3. Update Author Information (Optional)

Add your information to `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "contributors": []
}
```

### 4. Build the Package

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Generate type definitions (`.d.ts` files)
- Create source maps

### 5. Verify Package Contents

Check what will be published:

```bash
npm pack --dry-run
```

This shows what files will be included in the package.

### 6. Test the Package Locally

Test the package locally before publishing:

```bash
# Create a tarball
npm pack

# In another project, install from tarball
npm install ../detect-in-app-browser/detect-in-app-browser-1.0.0.tgz
```

## Publishing

### 1. Login to npm

```bash
npm login
```

Enter your npm username, password, and email.

### 2. Publish

```bash
# Publish to npm
npm publish

# Or if you want to publish as public (default)
npm publish --access public
```

### 3. Verify Publication

1. Check npm website: https://www.npmjs.com/package/detect-in-app-browser
2. Test installation: `npm install detect-in-app-browser`
3. Verify in a test project

## Post-Publishing

### 1. Create Git Tag

After publishing, create a git tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2. Update CHANGELOG (Optional)

Create or update `CHANGELOG.md` with release notes.

### 3. Update Documentation

If needed, update the README with new features or changes.

## Updating the Package

For future updates:

1. Make your changes
2. Update version: `npm version patch|minor|major`
3. Build: `npm run build`
4. Test: `npm pack --dry-run`
5. Publish: `npm publish`
6. Tag: `git tag v1.0.1 && git push origin v1.0.1`

## Troubleshooting

### Package name already exists

If the package name is taken, you can:
- Use a scoped package: `@yourusername/detect-in-app-browser`
- Choose a different name

To use scoped package, update `package.json`:

```json
{
  "name": "@yourusername/detect-in-app-browser"
}
```

Then publish with:

```bash
npm publish --access public
```

### Authentication errors

- Check you're logged in: `npm whoami`
- Re-login: `npm login`

### Build errors

- Ensure TypeScript is installed: `npm install`
- Check for TypeScript errors: `npm run build`
- Verify tsconfig.json is correct

## Package Structure

The published package will include:

```
detect-in-app-browser/
├── dist/           # Compiled JavaScript and type definitions
├── README.md       # Documentation
├── LICENSE         # MIT License
└── package.json    # Package metadata
```

## Best Practices

1. ✅ Always test locally before publishing
2. ✅ Use semantic versioning (major.minor.patch)
3. ✅ Update version before publishing
4. ✅ Create git tags for releases
5. ✅ Keep CHANGELOG.md updated
6. ✅ Test the published package in a fresh project

## Version Numbering

- **Patch** (1.0.0 → 1.0.1): Bug fixes, small changes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Major** (1.0.0 → 2.0.0): Breaking changes

