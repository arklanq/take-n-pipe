/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  /*
   * General configuration
   */
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'], // order matters
  testRegex: '.*\\.test\\.ts$',
  testMatch: null, // Must be set to null, see https://kulshekhar.github.io/ts-jest/docs/getting-started/presets
  roots: ['<rootDir>/src', '<rootDir>/test'], // can be explicitly overriden by CLI option
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',

  /*
   * ESM & TypeScript configuration
   */
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

export default config;
