const plugins = [
    require("rollup-plugin-node-resolve")(),
    require("rollup-plugin-commonjs")(),

    process.env.PRODUCTION ?
        require("rollup-plugin-strip-code")({
            start_comment : "START.TESTSONLY",
            end_comment   : "END.TESTSONLY"
        }) :
        {},
    
    process.env.PRODUCTION ?
        require("rollup-plugin-uglify")() :
        {},
];

const es6 = {
    input : "src/index.js",

    output : [
        {
            file : "dist/aws-sig.esm.js",
            format : "es",
            sourcemap : true,
        },
        {
            file : "dist/aws-sig.cjs.js",
            format : "cjs",
            sourcemap : true,
        }
    ],

    plugins
};

const es5 = {
    input : "src/index.js",

    output : [
        {
            file : "dist/es5/aws-sig.esm.js",
            format : "es",
            sourcemap : true,
        },
        {
            file : "dist/es5/aws-sig.cjs.js",
            format : "cjs",
            sourcemap : true,
        }
    ],

    plugins : plugins.concat(require("rollup-plugin-buble")())
};

module.exports = process.env.PRODUCTION ?
    [ es5, es6 ] : es6;
