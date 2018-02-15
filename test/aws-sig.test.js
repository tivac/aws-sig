"use strict";

const config = require("./config.js");

const sign = require("../dist/aws-sig.cjs.js");

describe("aws-sig", () => {
    it("Should sort SignedHeaders by name", () => {
        expect(
            sign({
                url     : "https://aws.amazon.com",
                headers : {
                    "X-Amz-Date" : "20150830T123600Z",

                    z : 1,
                    a : 1,
                    m : 1
                }
            }, config())
        ).toMatchSnapshot();
    });
});
