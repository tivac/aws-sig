"use strict";

const pkg = require("./package.json");

const input = "./src/index.js";

const replace = require("rollup-plugin-replace")({
    ISTESTING : Boolean(process.env.ISTESTING),
});

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

        external : [
            "strict-uri-encode",
        ],

        plugins : [
            replace,
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
            replace,
            require("rollup-plugin-node-resolve")(),
            require("rollup-plugin-commonjs")(),
            require("rollup-plugin-buble")(),
            require("rollup-plugin-uglify").uglify(),
        ],
    },
];
