// filepath: /c:/Users/nares/Coding-Line/Company/GoannyHRMS/frontend/vite.config.js
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
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
      "jspdf" , 
      "jspdf-autotable"
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
// import react from "@vitejs/plugin-react";
// import path from "path";
// import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [
//     react({
//       jsxImportSource: "@emotion/react",
//       babel: {
//         plugins: [
//           "@emotion/babel-plugin",
//           [
//             "@babel/plugin-transform-react-jsx",
//             {
//               runtime: "automatic",
//             },
//           ],
//         ],
//       },
//     }),
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     port: 3000,
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       loader: {
//         ".js": "jsx",
//         ".ts": "tsx",
//       },
//       define: {
//         global: "globalThis",
//       },
//     },
//     include: [
//       "@emotion/react",
//       "@emotion/styled",
//       "@mui/material",
//       "@mui/icons-material",
//     ],
//   },
//   esbuild: {
//     loader: "jsx",
//     include: /src\/.*\.jsx?$/,
//     exclude: [],
//   },
// });
