"use strict";

const pkg = require("./package.json");
const env = require("./build/rollup-environment.js");

const banner = `/*! aws-sig@${pkg.version} !*/`;

const input = "./src/aws-sig.js";

module.exports = [
    // ESM & CJS builds
    {
        input : [
            input,
            "./src/signed-headers.js",
            "./src/signed-query.js",
        ],

        output : [{
            dir       : "./dist",
            format    : "cjs",
            sourcemap : true,
            banner,
            
            entryFileNames : "[name].[format].js",
            chunkFileNames : "[name].[format].js",
        }, {
            dir       : "./dist",
            format    : "es",
            sourcemap : true,
            banner,

            entryFileNames : "[name].[format].js",
            chunkFileNames : "[name].[format].js",
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
