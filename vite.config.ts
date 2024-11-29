import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: "src/afova.ts",
      name: "afova",
      fileName: (format) => "afova.js",
      formats: ["es"],
    },
    minify: "terser",
    terserOptions: {
      toplevel: true,
      mangle: true,
      keep_fnames: false,
    },
  },
  plugins: [dts()],
});
