"use strict";

const pkg = require("./package.json");
const env = require("./build/rollup-environment.js");

const input = "./src/index.js";

module.exports = [
    // ESM & CJS builds
    {
        input,

        output : [{
            file      : pkg.main,
            format    : "cjs",
            sourcemap : true,
        }, {
            file      : pkg.module,
            format    : "es",
            sourcemap : true,
        }],

        plugins : [
            env,
        ],
    },

    // browser UMD build
    {
        input,

        output : {
            name      : pkg.name,
            file      : pkg.browser,
            format    : "umd",
            sourcemap : true,
        },

        plugins : [
            env,
            require("rollup-plugin-node-resolve")(),
            require("rollup-plugin-commonjs")(),
            require("rollup-plugin-buble")(),
            require("rollup-plugin-terser").terser(),
        ],
    },
];
