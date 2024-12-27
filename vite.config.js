// filepath: /c:/Users/nares/Coding-Line/Company/GoannyHRMS/frontend/vite.config.js
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    'process.env': process.env,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 4000,
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    include: [
      "moment",
      "@emotion/react",
      "@emotion/styled",
      "@mui/material",
      "@mui/system",
    ],
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".ts": "tsx",
        ".tsx": "tsx",
      },
    },
  },
});
