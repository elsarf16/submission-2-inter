import { defineConfig } from "vite";
import path from "path";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'sw-assets.json', dest: '' }
      ]
    })
  ]
});
