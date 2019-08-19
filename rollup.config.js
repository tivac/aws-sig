"use strict";

const pkg = require("./package.json");
const env = require("./build/rollup-environment.js");

const banner = `/*! aws-sig@${pkg.version} !*/`;

const input = "./src/index.js";

module.exports = [
    // ESM & CJS builds
    {
        input,

        output : [{
            file      : pkg.main,
            format    : "cjs",
            sourcemap : true,
            banner,
        }, {
            file      : pkg.module,
            format    : "es",
            sourcemap : true,
            banner,
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
            banner,
        },

        plugins : [
            env,
            require("rollup-plugin-node-resolve")(),
            require("rollup-plugin-commonjs")(),
            require("rollup-plugin-buble")(),
            require("rollup-plugin-terser").terser({
                output : {
                    comments : /^!/,
                },
            }),
        ],
    },
];
