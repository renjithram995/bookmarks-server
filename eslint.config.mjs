import pluginJs from "@eslint/js";

// Manually defining Node.js globals
const nodeGlobals = {
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  clearImmediate: 'readonly',
  clearInterval: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  exports: 'readonly',
  global: 'readonly',
  module: 'readonly',
  process: 'readonly',
  queueMicrotask: 'readonly',
  require: 'readonly',
  setImmediate: 'readonly',
  setInterval: 'readonly',
  setTimeout: 'readonly',
};


export default [
  {
    files: ["**/*.js"],
    languageOptions:
      {
        sourceType: "commonjs",
        ecmaVersion: 12,
        globals: {
          ...nodeGlobals,     // Include Node.js globals
          process: 'readonly', // Specify process as readonly
        },
      },
      rules: {
        'no-console': 'off',
        'indent': ['error', 2],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-extra-semi': 'error'
      }
    },
  pluginJs.configs.recommended,
];