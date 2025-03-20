import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs", 
      globals: { ...globals.node, ...globals.jest } 
    }
  },
  pluginJs.configs.recommended,
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js"], // Apply Jest rules only to test files
    plugins: {
      jest: pluginJest
    },
    settings: {
      jest: {
        version: 29 // Specify your Jest version to ensure compatibility
      }
    },
    rules: {
      ...pluginJest.configs.recommended.rules, // Spread Jest rules correctly
      'no-unused-vars': 'warn',
    }
  }
];
