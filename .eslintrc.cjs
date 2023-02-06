module.exports = {
  root: true,
  env: {
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: require.resolve('./tsconfig.json'),
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint'],
  settings: {
    'import/resolver': {
      [[require.resolve('eslint-import-resolver-typescript')]]: {
        project: require.resolve('./tsconfig.json'),
        alwaysTryTypes: true,
        extensions: ['.ts', '.d.ts'],
      },
    },
  },
  rules: {
    // Write clean, elegant code that does not exceed a reasonable file length limit
    'max-lines': ['warn', 300],
    // Don't leave stupid console calls in code!
    'no-console': ['warn', {allow: ['warn', 'error', 'info']}],
    // Don't leave floating Promises in the codebase. If needed explicitly mark them with `void` operator.
    '@typescript-eslint/no-floating-promises': ['warn', {ignoreVoid: true}],
    // Annoying if used on purpose
    '@typescript-eslint/no-non-null-assertion': 'off',
    // Allow explicit type declarations everywhere
    '@typescript-eslint/no-inferrable-types': 'off',
    // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
    'default-case': 'off',
    // Allow unused vars with leading underscore
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_', // Ignore args starting with underscore
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    // Disable explicit function return types
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Don't ban `object` type as Record<string, unknown> is not actually the best solution
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {object: false},
      },
    ],
  }
};
