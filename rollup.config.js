import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default [
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false, // We'll use tsc for declarations
      }),
      isProduction && terser(),
    ].filter(Boolean),
    external: [
      '@iarna/toml',
      'commander',
      'chalk',
      'ora',
      'inquirer',
      'fs',
      'path',
      'fs-extra',
      'axios',
      'form-data',
      'replicate',
    ],
  },
  
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      isProduction && terser(),
    ].filter(Boolean),
    external: [
      '@iarna/toml',
      'commander',
      'chalk',
      'ora',
      'inquirer',
      'fs',
      'path',
      'fs-extra',
      'axios',
      'form-data',
      'replicate',
    ],
  },
  
  // CLI build
  {
    input: 'src/cli/index.ts',
    output: {
      file: 'dist/cli/index.js',
      format: 'cjs',
      sourcemap: true,
      banner: '#!/usr/bin/env node',
    },
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      isProduction && terser(),
    ].filter(Boolean),
    external: [
      '@iarna/toml',
      'commander',
      'chalk',
      'ora',
      'inquirer',
      'fs',
      'path',
      'fs-extra',
      'axios',
      'form-data',
      'replicate',
    ],
  },
];