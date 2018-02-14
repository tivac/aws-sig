"use strict";

const conditional = require("rollup-plugin-conditional");

const pkg = require("./package.json");

const input = "./src/index.js";
const production = Boolean(process.env.PRODUCTION);

module.exports = [
    // browser UMD build
    {
        input,

        output : {
            name : pkg.name,
            file : pkg.browser,
            format : "umd"
        },

        plugins : [
            require("rollup-plugin-node-resolve")(),
            require("rollup-plugin-commonjs")(),
            
            conditional(production, [
                require("rollup-plugin-buble")(),
                require("rollup-plugin-strip-code")({
                    start_comment : "START.TESTSONLY",
                    end_comment   : "END.TESTSONLY"
                }),
                require("rollup-plugin-uglify")()
            ])
        ]
    },

    // ESM & CJS builds
    {
        input,

        output : [{
            file : pkg.main,
            format : "cjs"
        }, {
            file : pkg.module,
            format : "es"
        }],

        external : [
            "strict-uri-encode"
        ]
    }
];
