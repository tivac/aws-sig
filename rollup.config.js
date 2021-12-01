"use strict";

import { writeFileSync } from "fs";
import { join } from "path";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import buble from "@rollup/plugin-buble";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

// Plugin for making stub package.json files that tell the type of the modules in the folder
// Resources:
// https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html
// https://2ality.com/2019/10/hybrid-npm-packages.html
// https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1
//
const stubby = (type) => ({
    name : `stubby-${type}`,

    writeBundle({ dir },) {
        writeFileSync(join(dir, "package.json"), JSON.stringify({ type }, null, 4));
    },
});

const banner = `/*! aws-sig@${pkg.version} !*/`;
const input = "./src/aws-sig.js";
const name = "[name].js";

export default [
    // ESM & CJS builds
    {
        input : [
            input,
            "./src/signed-headers.js",
            "./src/signed-query.js",
        ],

        plugins : [
            nodeResolve(),
            cjs(),
        ],

        output : [{
            dir       : "./dist/cjs",
            format    : "cjs",
            sourcemap : true,
            banner,
            
            entryFileNames : name,
            chunkFileNames : name,

            plugins : [
                stubby("commonjs"),
            ],
        }, {
            dir       : "./dist/esm",
            format    : "es",
            sourcemap : true,
            banner,

            entryFileNames : name,
            chunkFileNames : name,

            plugins : [
                stubby("module"),
            ],
        }],
    },

    // browser UMD build
    {
        input,

        plugins : [
            nodeResolve(),
            cjs(),
            buble(),
        ],

        output : [{
            name      : pkg.name,
            file      : "./dist/umd/aws-sig.js",
            format    : "umd",
            sourcemap : true,
            banner,
        }, {
            name      : pkg.name,
            file      : "./dist/umd/aws-sig.min.js",
            format    : "umd",
            sourcemap : true,
            banner,

            plugins : [
                terser({
                    output : {
                        comments : /^!/,
                    },
                }),
            ],
        }],
    },
];
