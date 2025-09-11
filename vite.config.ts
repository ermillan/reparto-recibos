import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(`🚀 Running Vite in ${mode} mode`);

  return {
    plugins: [
      react(),
      tailwindcss(), // Plugin oficial para Tailwind
    ],
    base: mode === "production" ? "/FrontRepartoRecibos/" : "/FrontRepartoRecibos/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },
    build: {
      outDir: "dist",
      sourcemap: mode !== "production", // mapas de fuente solo en dev/staging
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
          },
        },
      },
    },
    server: {
      open: true,
      port: 5173, // puerto estándar de Vite, se puede personalizar
      strictPort: true,
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    css: {
      modules: {
        localsConvention: "camelCase", // para importar estilos en formato camelCase
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
  };
});
