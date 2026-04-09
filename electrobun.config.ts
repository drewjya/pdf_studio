import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "PdfStudio",
    identifier: "com.drewjya.pdfstudio",
    version: "0.0.1",
    urlSchemes: ["pdfstudio"],
  },
  build: {
    copy: {
      "dist/index.html": "views/mainview/index.html",
      "dist/assets": "views/mainview/assets",
    },
    watchIgnore: ["dist/**"],
    mac: {
      bundleCEF: false,
    },
    linux: {
      bundleCEF: false,
      icon: "icon.iconset/icon_256x256.png",
    },
    win: {
      bundleCEF: false,
      icon: "icon.iconset/icon.ico",
    },
  },
  runtime: {
    generatePatch: false,
  },
} satisfies ElectrobunConfig;
