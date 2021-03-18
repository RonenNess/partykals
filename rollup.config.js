import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
const DEV = process.env.NODE_ENV === "development";
export default {
  input: "./partykals/index.js",
  output: [{
    file: "./dist/partykals.module.js",
    format: "cjs",
    sourcemap: false,
    name: "partykals",
    globals:{
        three:"THREE"
    }
  },{
    file: "./dist/partykals.js",
    format: "iife",
    sourcemap:  false,
    name: "partykals",
    globals:{
        three:"THREE"
    }
  }],
  external: ["three"],
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    babel({
      exclude: "node_modules/**",
      compact: DEV ? "auto" : true,
      presets: [
        [
          "@babel/preset-env",
          {
            // "debug": true,
            targets: {
              browsers: "last 10 versions"
            }
          }
        ]
      ],
      extensions: [".js", ".mjs", ".html", ".svelte"]
    })
  ]

};
