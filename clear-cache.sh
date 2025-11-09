#!/bin/bash
# Clear all TypeScript and VS Code caches

echo "🧹 Clearing TypeScript and VS Code caches..."

# Remove TypeScript build info
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true

# Remove node_modules .cache directories  
find node_modules -name ".cache" -type d -exec rm -rf {} + 2>/dev/null || true

# Clear npm cache
npm cache clean --force 2>/dev/null || true

# Remove dist directory
rm -rf dist 2>/dev/null || true

# Remove .vscode workspace cache if it exists
rm -rf .vscode/.cache 2>/dev/null || true

# Update .vscode settings to force restart
mkdir -p .vscode
cat > .vscode/settings.json << EOF
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": false,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true
  }
}
EOF

echo "✅ Cache cleared! Please reload VS Code window for changes to take effect."
echo "📝 In VS Code: Press Ctrl+Shift+P > 'Developer: Reload Window'"