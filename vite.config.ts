import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/afova.ts",
      name: "afova",
      fileName: (format) => {
        if (format == "iife") {
          return `afova.iife.cjs`;
        } else {
          return "afova.js";
        }
      },
      formats: ["es", "iife"],
    },
    minify: "terser",
    terserOptions: {
      toplevel: true,
      mangle: true,
      keep_classnames: false,
      keep_fnames: false,
    },

    watch: {},
  },
  plugins: [dts()],
});
