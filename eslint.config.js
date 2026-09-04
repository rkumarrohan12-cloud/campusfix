import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // Node / server-side files (Express backend) live under src/ and use
  // CommonJS `require`/`module.exports`. Provide an override so ESLint
  // doesn't flag `require`, `module`, `process`, or `__dirname` as undefined.
  {
    files: [
      'src/server.js',
      'src/app.js',
      'src/config/**',
      'src/controllers/**',
      'src/middleware/**',
      'src/routes/**',
      'src/utils/**',
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: { ecmaVersion: 2022, sourceType: 'script' },
    },
  },
])
