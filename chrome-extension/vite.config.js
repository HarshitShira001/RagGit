import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

function copyExtensionFiles() {
  return {
    name: "copy-extension-files",
    closeBundle() {
      // content.js and background.js must be standalone — NOT bundled by Vite
      copyFileSync("src/content.js",    "dist/content.js");
      copyFileSync("src/background.js", "dist/background.js");

      // Icons
      mkdirSync("dist/icons", { recursive: true });
      ["icon16.png", "icon48.png", "icon128.png"].forEach(function(icon) {
        var src = "public/icons/" + icon;
        if (existsSync(src)) copyFileSync(src, "dist/icons/" + icon);
      });

      console.log("✅ content.js + background.js + icons copied to dist/");
    },
  };
}

export default defineConfig({
  plugins: [react(), copyExtensionFiles()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: { index: resolve(__dirname, "index.html") },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
  },
});
