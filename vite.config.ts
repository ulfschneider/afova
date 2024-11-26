import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/afova.ts",
      name: "afova",
      fileName: (format) => `afova.js`,
      formats: ["es"],
    },
    minify: "terser",
    terserOptions: {
      toplevel: true,
    },
    watch: {},
  },
});
