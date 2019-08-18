"use strict";

const config = require("./lib/config.js");

const sign = require("../src/index.js");

describe("aws-sig API", () => {
    it("should sort SignedHeaders by name", () => {
        expect(
            sign({
                url     : "https://aws.amazon.com",
                headers : {
                    "X-Amz-Date" : "20150830T123600Z",

                    z : 1,
                    a : 1,
                    m : 1,
                },
            }, config())
        ).toMatchSnapshot();
    });

    it("should throw on a missing request param", () => {
        expect(() =>
            sign()
        ).toThrowErrorMatchingSnapshot();
    });

    it("should throw on missing config param", () => {
        expect(() =>
            sign({})
        ).toThrowErrorMatchingSnapshot();
    });

    it("should throw on a missing config param values", () => {
        expect(() =>
            sign({ url : "https://aws.amazon.com" }, {})
        ).toThrowErrorMatchingSnapshot();
    });
    
    it("should be precise about the missing config param values", () => {
        const conf = config();

        delete conf.accessKeyId;
        delete conf.region;
        
        expect(() =>
            sign({ url : "https://aws.amazon.com" }, conf)
        ).toThrowErrorMatchingSnapshot();
    });

    it("should clean up paths with relative directory specifiers", () => {
        expect(
            sign({
                url : "https://aws.amazon.com/foo/./bar/../baz",
            }, config()).test.canonical
        ).toMatchSnapshot();
    });
    
    it("should clean up paths with multiple slashes", () => {
        expect(
            sign({
                url : "https://aws.amazon.com/foo/////bar",
            }, config()).test.canonical
        ).toMatchSnapshot();
    });

    it.each([
        "/foo bar",
        "/foo%20bar",
        "/%20",
        "/%2a",
        "/%41",
        "/ü",
        "/arn%3Aaws%3Aservice%3Aus-west-2%3A%3Aident%2Fid1%2Fid2",
        "/foo*",
    ])("should double-encode each path segment (%s)", (path) => {
        expect(
            sign({
                url : `https://aws.amazon.com${path}`,
            }, config()).test.canonical
        ).toMatchSnapshot();
    });
});
