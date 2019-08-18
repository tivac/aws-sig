"use strict";

const fs = require("fs");
const path = require("path");

const { readDirDeepSync : read } = require("read-dir-deep");

const parse  = require("./lib/parse-request.js");
const build  = require("./lib/build-request.js");
const config = require("./lib/config.js");

const sign = require("../src/index.js");

const specimensDir = path.resolve(__dirname, "./specimens/aws-sig-v4-test-suite");

const ignored = new Set([
    // aws-sig test request parsing lib doesn't handle this atm
    "get-header-value-multiline",

    // TEST SUITE ISSUE: Request includes Content-Length header, but signatures don't
    "post-x-www-form-urlencoded",
    "post-x-www-form-urlencoded-parameters",

    // TEST SUITE ISSUE: Supposed to encode each path segment twice, but only encoded once
    "get-utf8",
    "get-space",
]);

const focused = new Set([
    // "post-x-www-form-urlencoded",
]);

describe("AWS Signature v4 Test Suite", () => {
    const files = read(specimensDir, {
        patterns : [
            "**/*.{req,creq,sreq,authz,sts}",
        ],
    });
    
    const tests = files.reduce((acc, file) => {
        const parsed = path.parse(file);

        if(!acc.has(parsed.name)) {
            acc.set(parsed.name, new Map());
        }

        acc.get(parsed.name).set(parsed.ext, fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n"));

        return acc;
    }, new Map());
    
    // Set up all the tests
    tests.forEach((specs, name) => {
        const conf = config({
            token : name === "post-sts-header-after",
        });
        
        let fn = it;
        
        if(ignored.has(name)) {
            fn = it.skip;
        }

        if(focused.has(name)) {
            fn = it.only;
        }
        
        fn(`${name}`, () => {
            const req = parse(specs.get(".req"));
            const signed = sign(req, conf);

            expect(signed.test.canonical).toBe(specs.get(".creq"));
            expect(signed.test.sts).toBe(specs.get(".sts"));
            expect(signed.test.auth).toBe(specs.get(".authz"));
            expect(build(signed)).toBe(specs.get(".sreq"));
        });
    });
});
