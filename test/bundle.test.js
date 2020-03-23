"use strict";

const { rollup } = require("rollup");
const requireFromString = require("require-from-string");

const env = require("../build/rollup-environment.js");

const config = require("./lib/config.js");

describe("bundle test", () => {
    it("should sign requests", async () => {
        const bundle = await rollup({
            input : "./src/aws-sig.js",

            plugins : [
                env,
            ],
        });

        const { output } = await bundle.generate({
            format : "cjs",
        });
        
        const [{ code }] = output;

        const { signedHeaders : sign } = requireFromString(code);

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
