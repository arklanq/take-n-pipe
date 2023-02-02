module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  settings: {
    'import/resolver': {
      [require.resolve('eslint-import-resolver-node')]: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
      },
      [[require.resolve('eslint-import-resolver-typescript')]]: {
        alwaysTryTypes: true,
        project: require.resolve('./tsconfig.json'),
      },
    },
  },
  rules: {
    // Write clean, elegant code that does not exceed a reasonable file length limit
    'max-lines': ['warn', 300],
    // Annoying if used on purpose - typescript is still not skilled enough to leave it turned on
    'no-non-null-assertion': 'off',
    // Don't leave stupid console calls in code!
    'no-console': ['warn', {allow: ['warn', 'error', 'info']}],
    // Allow unused vars with leading underscore
    'no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_', // ignore args starting with underscore
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: require.resolve('./tsconfig.json'),
      },
      extends: ['plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
      rules: {
        // Don't leave floating Promises in the codebase. If needed explicitly mark them with `void` operator.
        '@typescript-eslint/no-floating-promises': ['warn', {ignoreVoid: true}],
        // Annoying if used on purpose
        '@typescript-eslint/no-non-null-assertion': 'off',
        // Allow explicit type declarations everywhere
        '@typescript-eslint/no-inferrable-types': 'off',
        // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
        'default-case': 'off',
        // Allow unused vars with leading underscore
        'no-unused-vars': 'off',
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
      },
    },
  ],
};
