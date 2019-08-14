"use strict";

const fs = require("fs");
const path = require("path");

const parse  = require("./lib/parse-request.js");
const build  = require("./lib/build-request.js");
const config = require("./lib/config.js");

const sign = require("../src/index.js");

const dir = fs.readdirSync("./test/specimens/aws-sig-v4-test-suite");

const ignored = new Set([
    // Request parsing lib just doesn't handle this atm, don't think I care given intended usage
    "get-header-value-multiline",
]);

const focused = new Set([
    // "normalize-path-get-space",
]);

describe("AWS Signature v4 Test Suite", () => {
    const specimens = new Map();

    // Read all specimen files into memory
    dir.forEach((test) => {
        const out = new Map();

        [ "req", "creq", "sreq", "authz", "sts" ].forEach((ext) => {
            out.set(
                ext,
                fs.readFileSync(
                    path.join(__dirname, "/specimens/aws-sig-v4-test-suite", test, `/${test.replace("normalize-path-", "")}.${ext}`),
                    "utf8"
                ).replace(/\r\n/g, "\n")
            );
        });

        specimens.set(test, out);
    });

    // Set up all the tests
    specimens.forEach((files, name) => {
        const conf = config({ token : name.includes("token") });
        
        if(ignored.has(name)) {
            it.skip(`Skipping ${name}`, () => {
                // TODO: required by jest
            });

            return;
        }

        const fn = focused.has(name) ? it.only : it;

        const req = parse(files.get("req"));
        const signed = sign(req, conf);
        
        fn(`${name} - canonical request`, () => {
            expect(signed.test.canonical).toEqual(files.get("creq"));
        });

        fn(`${name} - string to sign`, () => {
            expect(signed.test.sts).toEqual(files.get("sts"));
        });

        fn(`${name} - Authorization value`, () => {
            expect(signed.test.auth).toEqual(files.get("authz"));
        });

        fn(`${name} - Request`, () => {
            expect(build(signed)).toEqual(files.get("sreq"));
        });
    });
});
