import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import esbuild from "esbuild";

const minify = {
  name: "minify",
  closeBundle: () => {
    esbuild.buildSync({
      entryPoints: ["./src/afova.ts"],
      minify: true,
      allowOverwrite: true,
      outfile: "./dist/afova.min.js",
      sourcemap: true,
    });
  },
};

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: "src/afova.ts",
      name: "afova",
      fileName: (format) => `afova.js`,
      formats: ["es"],
    },
  },
  plugins: [dts(), minify],
});
