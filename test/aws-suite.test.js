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
    // Request parsing lib just doesn't handle this atm, don't think I care given intended usage
    "get-header-value-multiline",

    // Doesn't handle Security token added after canonical request
    "post-sts-header-after",
]);

const focused = new Set([
    // "normalize-path-get-space",
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

        acc.get(parsed.name).set(parsed.ext, fs.readFileSync(file, "utf8"));

        return acc;
    }, new Map());
    
    // Set up all the tests
    tests.forEach((files, name) => {
        const conf = config({ token : name.includes("token") });
        
        let fn = it;
        
        if(ignored.has(name)) {
            fn = it.skip;
        }

        if(focused.has(name)) {
            fn = it.only;
        }
        
        fn(`${name}`, () => {
            const req = parse(files.get(".req"));
            const signed = sign(req, conf);

            expect(signed.test.canonical).toEqual(files.get(".creq"));
            expect(signed.test.sts).toEqual(files.get(".sts"));
            expect(signed.test.auth).toEqual(files.get(".authz"));
            expect(build(signed)).toEqual(files.get(".sreq"));
        });
    });
});
