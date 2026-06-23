import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";

const frontendRoot = fileURLToPath(new URL(".", import.meta.url));
// Project root is one level up — .env lives there
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  root: frontendRoot,
  // Tell Vite to load .env from the project root (where the file actually lives)
  envDir: projectRoot,
  cacheDir: "../node_modules/.vite",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
