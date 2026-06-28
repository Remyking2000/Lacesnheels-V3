import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";

const frontendRoot = fileURLToPath(new URL(".", import.meta.url));
// Project root is one level up — .env lives there
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  root: frontendRoot,
  envDir: projectRoot,
  cacheDir: "../node_modules/.vite",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor":  ["react", "react-dom", "react-router-dom"],
          "ui-vendor":     ["framer-motion", "lucide-react", "sonner"],
          "query-vendor":  ["@tanstack/react-query"],
          "charts-vendor": ["recharts"],
          "radix-vendor":  [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-checkbox",
          ],
          "google-vendor": ["@react-oauth/google"],
          "form-vendor":   ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
  },
});
