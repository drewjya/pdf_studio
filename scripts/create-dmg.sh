#!/usr/bin/env bash
# Create DMG with PdfStudio app
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_ROOT/build"

# Find the PdfStudio wrapper app
APP=$(find "$BUILD_DIR" -maxdepth 1 -name "PdfStudio.app" -type d 2>/dev/null | head -1)

if [ -z "$APP" ]; then
    echo "[create-dmg] Error: PdfStudio.app not found in $BUILD_DIR" >&2
    exit 1
fi

echo "[create-dmg] Creating DMG with PdfStudio.app..."

# Remove any existing DMG files to avoid duplicates
rm -f "$BUILD_DIR"/*.dmg

# Create temp directory for DMG layout
DMG_TEMP=$(mktemp -d /tmp/pdfstudio_dmg.XXXXXX)

# Copy app
cp -R "$APP" "$DMG_TEMP/"

# Create Applications symlink
ln -s /Applications "$DMG_TEMP/Applications"

# Output DMG path
DMG_PATH="$BUILD_DIR/PdfStudio.dmg"

# Create DMG with hdiutil
SIZE=$(du -sm "$DMG_TEMP" | cut -f1)
SIZE=$((SIZE + 20))  # Add padding

echo "[create-dmg] Packing DMG..."
hdiutil create -srcfolder "$DMG_TEMP" -volname "PdfStudio" -fs HFS+ \
    -format UDZO -size "${SIZE}m" "$DMG_PATH" 2>/dev/null || {
    echo "[create-dmg] Error: hdiutil failed" >&2
    rm -rf "$DMG_TEMP"
    exit 1
}

# Clean up
rm -rf "$DMG_TEMP"

echo "[create-dmg] Created: $DMG_PATH"
echo "[create-dmg] Done."
