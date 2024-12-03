import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: "src/afova.ts",
      name: "afova",
      fileName: (format) => {
        if (format == "cjs") {
          return `afova.min.js`;
        } else {
          return `afova.js`;
        }
      },
      formats: ["es", "cjs"],
    },
    minify: "terser",
    sourcemap: true,
  },
  plugins: [dts()],
});
