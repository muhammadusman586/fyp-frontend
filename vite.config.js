import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/fyp-frontend",
  server: {
    proxy: {
      "/api/": "https://fyp-backend-p1jf.onrender.com",
      "/uploads/": "https://fyp-backend-p1jf.onrender.com",
    },
  },
});
