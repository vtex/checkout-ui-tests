module.exports = {
  extends: 'vtex',
  plugins: ['cypress'],
  env: {
    es6: true,
    mocha: true,
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  rules: {
    'no-console': 'off',
    'jest/prefer-todo': 'off',
    'jest/no-disabled-tests': 'off',
    'jest/expect-expect': 'off',
  },
  globals: {
    cy: true,
    Cypress: true,
  },
  overrides: [
    {
      files: ['./tests/**/*', './utils/**/*', './src/**/*'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
    },
  ],
}
