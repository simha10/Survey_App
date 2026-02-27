const { defineConfig } = require('eslint/config-eslint');
const compat = require('eslint-config-expo/flat');

module.exports = defineConfig([
  ...compat,
  {
    ignores: ['node_modules', 'dist', 'build'],
  },
]);
