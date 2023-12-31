/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'universe/native', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'import/order': 'off',
  },
};
