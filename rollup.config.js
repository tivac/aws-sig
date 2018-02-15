"use strict";

const pkg = require("./package.json");

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

        external : [
            "strict-uri-encode"
        ]
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
            require("rollup-plugin-node-resolve")(),
            require("rollup-plugin-commonjs")(),
            require("rollup-plugin-buble")(),
            require("rollup-plugin-strip-code")({
                start_comment : "START.TESTSONLY",
                end_comment   : "END.TESTSONLY"
            }),
            require("rollup-plugin-uglify")()
        ]
    },
];
