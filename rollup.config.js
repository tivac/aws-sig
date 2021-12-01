"use strict";

import { nodeResolve } from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import buble from "@rollup/plugin-buble";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const banner = `/*! aws-sig@${pkg.version} !*/`;

const input = "./src/aws-sig.js";

export default [
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
            nodeResolve(),
            cjs(),
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
            nodeResolve(),
            cjs(),
            buble(),
            terser({
                output : {
                    comments : /^!/,
                },
            }),
        ],
    },
];
