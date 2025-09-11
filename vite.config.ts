/* eslint-disable no-console */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  console.log(`🚀 Running Vite in ${mode} mode`);

  return {
    plugins: [react(), tailwindcss()],
    base: mode === "production" ? "/FrontRepartoRecibos/" : "/FrontRepartoRecibos/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@ui": "@/components/ui",
      },
    },
    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@radix-ui")) return "ui";
              if (id.includes("lucide-react")) return "ui";
              if (id.includes("react-router-dom")) return "router";
              if (id.includes("react")) return "react";
            }
          },
        },
      },
    },
    server: {
      open: true,
      port: 5173,
      strictPort: true,
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    css: {
      modules: {
        localsConvention: "camelCase",
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
  };
});
