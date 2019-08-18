"use strict";

const { transformSync } = require("@babel/core");
const { rollup } = require("rollup");
const requireFromString = require("require-from-string");

const env = require("../build/rollup-environment.js");

const config = require("./lib/config.js");

describe("bundle test", () => {
    // const { node : ver } = process.versions;
    // const [ major ] = ver.split(".");

    // // Node < 10 doesn't support new URL()
    // const fn = parseInt(major, 10) >= 10 ? it : it.skip;

    it("should sign requests", async () => {
        const bundle = await rollup({
            input : "./src/index.js",

            plugins : [
                env,
            ],
        });

        const { code } = await bundle.generate({
            format : "cjs",
        });

        const transformed = transformSync(code);

        const sign = requireFromString(transformed);

        expect(
            sign({
                url     : "https://aws.amazon.com/foo",
                headers : {
                    "X-Amz-Date" : "20150830T123600Z",
                },
            }, config())
        ).toMatchSnapshot();
    });
});
