"use strict";

const fs = require("fs");
const path = require("path");

const parse  = require("./parse-request.js");
const build  = require("./build-request.js");
const config = require("./config.js");

const sign = require("../dist/aws-sig.cjs.js");

const dir = fs.readdirSync("./test/specimens/aws-sig-v4-test-suite");

const ignored = [
    // Request parsing lib just doesn't handle this atm, don't think I care given intended usage
    "get-header-value-multiline",
];

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
        
        if(ignored.indexOf(name) > -1) {
            it.skip(`Skipping ${name}`);

            return;
        }

        const req = parse(files.get("req"));
        const signed = sign(req, conf);
        
        it(`${name} - canonical request`, () => {
            expect(signed.test.canonical).toEqual(files.get("creq"));
        });

        it(`${name} - string to sign`, () => {
            expect(signed.test.sts).toEqual(files.get("sts"));
        });

        it(`${name} - Authorization value`, () => {
            expect(signed.test.auth).toEqual(files.get("authz"));
        });

        it(`${name} - Request`, () => {
            expect(build(signed)).toEqual(files.get("sreq"));
        });
    });
});
