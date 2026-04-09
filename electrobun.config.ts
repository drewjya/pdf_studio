import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "PdfStudio",
    identifier: "com.drewjya.pdf_studio",
    version: "0.0.1",
  },
  build: {
    bun: {
      entrypoint: "src/bun/index.ts",
    },
    views: {
      mainview: {
        entrypoint: "src/renderer/script.ts",
      },
    },
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
    exitOnLastWindowClosed: true,
  },
} satisfies ElectrobunConfig;
