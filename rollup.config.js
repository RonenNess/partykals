import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
    // input for bundle, same concept as 'entry' in webpack
    input: './src/index.js',
    // non-relative imports are not included by rollup,
    // here we explicitly list our external deps
    external: ['three'],
    output: {
        file: './dist/index.js',
        format: 'esm',
        compact: true,
        name: 'P'
    },
    plugins: [
        resolve(),
        babel({
            exclude: ['node_modules/**'],
            //runtimeHelpers: true
        }),
        commonjs(),
        terser(),
        json()
    ]
};
