import path from 'node:path';

import plugin_delete from 'rollup-plugin-delete';
import plugin_commonjs from '@rollup/plugin-commonjs';
import plugin_nodeResolve from '@rollup/plugin-node-resolve';
import plugin_typescript from '@rollup/plugin-typescript';
import plugin_typescriptAlias from './rollup-plugin-typescript-alias.js';
import plugin_generatePackageJson from 'rollup-plugin-generate-package-json';

import {externalDependencies, rootDirPath} from './utils.js';

// ESM build
const config = {
  input: path.resolve(rootDirPath, './src/index.ts'),
  plugins: [
    // Clean `dist` directory before next build
    plugin_delete({
      targets: ['dist/esm'],
    }),
    // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
    plugin_commonjs(),
    // Allows Rollup to find modules using Node.js modules resolution
    plugin_nodeResolve({
      preferBuiltins: true
    }),
    // Allows Rollup to convert TypeScript to JavaScript
    // Emit .js, .js.map
    plugin_typescript({
      tsconfig: path.resolve(rootDirPath, './tsconfig.json'),
      compilerOptions: {
        outDir: 'dist/esm',
        sourceMap: true,
        sourceRoot: path.resolve(rootDirPath),
      },
      include: ['src/**/*.ts'],
    }),
    // Allows Rollup to convert TypeScript to JavaScript
    // Emit .d.ts, .d.ts.map
    plugin_typescript({
      tsconfig: path.resolve(rootDirPath, './tsconfig.json'),
      compilerOptions: {
        outDir: 'dist/esm',
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
      },
      include: ['src/**/*.ts'],
    }),
    // Replace alias paths with relative paths after typescript compilation
    plugin_typescriptAlias({
      outDir: 'dist/esm',
      declarationDir: 'dist/esm',
    }),
    // Generate package.json
    plugin_generatePackageJson({
      baseContents: (_pkg) => ({
        type: 'module'
      })
    }),
  ],
  external: externalDependencies,
  output: {
    dir: 'dist/esm',
    format: 'es',
    exports: 'named',
    preserveModules: true,
    preserveModulesRoot: '.',
    sourcemap: true,
  },
};

Object.defineProperty(config, '__bundleName', {
  configurable: true,
  enumerable: false,
  writable: false,
  value: 'ESM',
});

export {config as esm_build_config}
