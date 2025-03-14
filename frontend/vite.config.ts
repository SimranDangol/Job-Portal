import * as path from "path"; // Fix TS1259
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:5000",
        secure: false, // http
      },
    },
  },
  plugins: [react()], // Removed @tailwindcss/vite
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
