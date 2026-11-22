import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        bypass(req) {
          if (
            req.url?.startsWith("/api/login") &&
            req.headers.accept?.includes("text/html")
          ) {
            return "/index.html";
          }
          return null;
        },
      },
      "/uploads": "http://localhost:8080",
    },
  },
});
