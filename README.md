# Migrating from Create React App to Vite

This guide will walk you through the process of migrating your React project from Create React App (CRA) to Vite. Vite offers faster build times and a more modern development experience.

## Step 1: Create Vite Configuration File

Create a new file named `vite.config.js` in the root of your project with the following content:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});
```

This configuration sets up the React plugin, configures path aliases, and sets the development server port.

## Step 2: Update package.json

1. Remove CRA-related dependencies and scripts.
2. Add Vite-related dependencies and scripts.
3. Update your `package.json` file to look like this:

```json
{
  "name": "SMarTea",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    // ... keep your existing dependencies ...
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.9"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "eslintConfig": {
    "extends": ["react-app", "react-app/jest"]
  },
  "browser": {
    "fs": false
  },
  "browserslist": [">0.2%", "not dead", "not op_mini all"]
}
```

## Step 3: Update index.html

1. Move `index.html` from the `public` folder to the root of your project.
2. Update its content to:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SMarTea</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
```

## Step 4: Update src/index.js

Modify your `src/index.js` file to use the new Vite-style imports:

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Step 5: Remove Unnecessary Files

Delete the following files that are no longer needed:

- `craco.config.js`

## Step 6: Update .gitignore

Add the following line to your `.gitignore` file:

```
# Vite
dist
```

## Step 7: Clean and Reinstall Dependencies

1. Delete the `node_modules` folder and `package-lock.json` file.
2. Run `npm install` to install the new dependencies.

## Step 8: Update Import Statements

Update any absolute import statements in your components. For example:

- Old: `import Component from 'components/Component'`
- New: `import Component from '@/components/Component'`

## Step 9: Update Environment Variables

Update any environment variable usage. In Vite, they should be prefixed with `VITE_` instead of `REACT_APP_`. For example:

- Old: `process.env.REACT_APP_API_URL`
- New: `import.meta.env.VITE_API_URL`

## Step 10: Start Development Server

Run your new Vite-powered development server:

```
npm run dev
```

## Step 11: Testing and Debugging

Thoroughly test your application after migration. There might be subtle differences between CRA and Vite that could affect your app's behavior. Be prepared to debug and adjust your code as needed.

## Additional Considerations

- If you're using any CRA-specific features, you may need to find Vite equivalents or alternatives.
- Some libraries might require additional configuration when used with Vite. Consult their documentation for Vite-specific setup instructions.
- If you're using CSS Modules, ensure that your `.module.css` files are properly recognized and processed by Vite.
- For TypeScript projects, you might need to update your `tsconfig.json` to work better with Vite.

By following these steps, you should be able to successfully migrate your Create React App project to Vite. Remember to commit your changes to version control regularly during the migration process.

```
<!--
This documentation provides a comprehensive guide for migrating your project from Create React App to Vite. It covers all the necessary steps, including configuration changes, file updates, and potential pitfalls to watch out for during the migration process.
```

const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
const content = fs.readFileSync(filePath, 'utf8');
const updatedContent = content.replace(/process\.env\.REACT*APP*/g, 'import.meta.env.VITE\_');

if (content !== updatedContent) {
fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log(`Updated: ${filePath}`);
}
}

function walkDir(dir) {
const files = fs.readdirSync(dir);
files.forEach(file => {
const filePath = path.join(dir, file);
const stat = fs.statSync(filePath);
if (stat.isDirectory()) {
walkDir(filePath);
} else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
replaceInFile(filePath);
}
});
}

// Start the script from your src directory
walkDir('./src'); -->
