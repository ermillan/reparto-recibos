import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  console.log(`Running in ${mode} mode`);
  return {
    plugins: [react(), tailwindcss()],
    base: "/FrontRepartoRecibos/",
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    server: {
      open: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
  };
});
