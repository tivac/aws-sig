module.exports = {
    input : "src/index.js",

    output : [
        {
            file : "dist/aws-sig.es.js",
            format : "es"
        },
        {
            file : "dist/aws-sig.cjs.js",
            format : "cjs"
        }
    ],

    plugins : [
        require("rollup-plugin-node-resolve")(),
        require("rollup-plugin-commonjs")(),
    ]
};
