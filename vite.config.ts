import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    // Dev only: serve the React app (app.html) for routes like /mission, as vercel.json does in production.
    {
      name: "app-html-fallback",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const path = (req.url ?? "").split("?")[0];
          if (req.method === "GET" && path !== "/" && !path.includes(".") && !/^\/(@|api\/|os\/|src\/|node_modules\/)/.test(path)) {
            req.url = "/app.html" + (req.url ?? "").slice(path.length);
          }
          next();
        });
      },
    },
  ],
  // The React app's entry is app.html; public/index.html (TBN OS) is served at "/".
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "app.html"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
