export interface Files {
    file_name: string;
    content: string;
  }
  
  const initialFiles: Files[] = [
    {
      file_name: "vite.config.ts",
      content: `import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import path from "path"
  
  // https://vite.dev/config/
  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  })
  `,
    },
    {
      file_name: "tsconfig.node.json",
      content: `{
    "compilerOptions": {
      "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
      "target": "ES2022",
      "lib": ["ES2023"],
      "module": "ESNext",
      "skipLibCheck": true,
  
      /* Bundler mode */
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "isolatedModules": true,
      "moduleDetection": "force",
      "noEmit": true,
  
      /* Linting */
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
      "noUncheckedSideEffectImports": true
    },
    "include": ["vite.config.ts"]
  }
  `,
    },
    {
      file_name: "tsconfig.json",
      content: `{
    "files": [],
    "references": [
      { "path": "./tsconfig.app.json" },
      { "path": "./tsconfig.node.json" }
    ],
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  `,
    },
    {
      file_name: "tsconfig.app.json",
      content: `{
    "compilerOptions": {
      "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "baseUrl": ".",
      "paths": {
        "@/*": [
          "./src/*"
        ]
      },
  
      /* Bundler mode */
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "isolatedModules": true,
      "moduleDetection": "force",
      "noEmit": true,
      "jsx": "react-jsx",
  
      /* Linting */
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
      "noUncheckedSideEffectImports": true
    },
    "include": ["src"]
  }
  `,
    },
    {
      file_name: "tailwind.config.js",
      content: `/** @type {import('tailwindcss').Config} */
  module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
      extend: {
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)'
        },
        colors: {}
      }
    },
    plugins: [require("tailwindcss-animate")],
  }
  `,
    },
    {
      file_name: "postcss.config.js",
      content: `export default {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
  `,
    },
    {
      file_name: "package.json",
      content: `{
    "name": "react-starter",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc -b && vite build",
      "lint": "eslint .",
      "preview": "vite preview"
    },
    "dependencies": {
      "@radix-ui/react-slot": "^1.1.1",
      "class-variance-authority": "^0.7.1",
      "clsx": "^2.1.1",
      "lucide-react": "^0.474.0",
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "tailwind-merge": "^2.6.0",
      "tailwindcss-animate": "^1.0.7"
    },
    "devDependencies": {
      "@eslint/js": "^9.17.0",
      "@types/node": "^22.12.0",
      "@types/react": "^18.3.18",
      "@types/react-dom": "^18.3.5",
      "@vitejs/plugin-react": "^4.3.4",
      "autoprefixer": "^10.4.20",
      "eslint": "^9.17.0",
      "eslint-plugin-react-hooks": "^5.0.0",
      "eslint-plugin-react-refresh": "^0.4.16",
      "globals": "^15.14.0",
      "postcss": "^8.5.1",
      "tailwindcss": "^3.4.17",
      "typescript": "~5.6.2",
      "typescript-eslint": "^8.18.2",
      "vite": "^6.0.5"
    }
  }
  `,
    },
    {
      file_name: "index.html",
      content: `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
  </html>
  `,
    },
    {
      file_name: "eslintrc.config.js",
      content: `import js from '@eslint/js'
  import globals from 'globals'
  import reactHooks from 'eslint-plugin-react-hooks'
  import reactRefresh from 'eslint-plugin-react-refresh'
  import tseslint from 'typescript-eslint'
  
  export default tseslint.config(
    { ignores: ['dist'] },
    {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
  )
  `,
    },
    {
      file_name: "components.json",
      content: `{
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "new-york",
    "rsc": false,
    "tsx": true,
    "tailwind": {
      "config": "tailwind.config.js",
      "css": "src/index.css",
      "baseColor": "neutral",
      "cssVariables": false,
      "prefix": ""
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils",
      "ui": "@/components/ui",
      "lib": "@/lib",
      "hooks": "@/hooks"
    },
    "iconLibrary": "lucide"
  }
  `,
    },
    {
      file_name: "src/main.tsx",
      content: `import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`,
  },
  {
    file_name: "src/App.tsx",
    content: `import { Code2, Sparkles } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Code2 className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Reacter <span className="text-indigo-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your intelligent coding companion. Write better React
            code faster with AI-powered assistance.
          </p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Start Coding
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
`,
  },
  {
    file_name: "src/index.css",
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
:root {
  --radius: 0.5rem
  }
}
`,
  },
  {
    file_name: "src/vite-env.d.ts",
    content: `/// <reference types="vite/client" />
`,
  },
  {
    file_name: "src/lib/utils.ts",
    content: `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
return twMerge(clsx(inputs))
}
`,
  },
];

export default initialFiles;