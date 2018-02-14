"use strict";

const fs = require("fs");
const path = require("path");

const parse = require("./parse-request.js");
const build = require("./build-request.js");

const sign = require("../dist/aws-sig.cjs.js");

const dir = fs.readdirSync("./test/specimens/aws-sig-v4-test-suite");

const config  = {
    region          : "us-east-1",
    service         : "service",
    accessKeyId     : "AKIDEXAMPLE",
    secretAccessKey : "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY"
};

const token = "AQoDYXdzEPT//////////wEXAMPLEtc764bNrC9SAPBSM22wDOk4x4HIZ8j4FZTwdQWLWsKWHGBuFqwAeMicRXmxfpSPfIeoIYRqTflfKD8YUuwthAx7mSEI/qkPpKPi/kMcGdQrmGdeehM4IC1NtBmUpp2wUE8phUZampKsburEDy0KPkyQDYwT7WZ0wq5VSXDvp75YU9HFvlRd8Tx6q6fE8YQcHNVXAkiY9q6d+xo0rKwT38xVqr7ZD0u0iPPkUL64lIZbqBAz+scqKmlzm8FDrypNC9Yjc8fPOLn9FX9KSYvKTr4rvx3iSIlTJabIQwj2ICCR/oLxBA==";

const ignored = [
    // Request parsing lib just doesn't handle this atm, don't think I care given intended usage
    "get-header-value-multiline"
];

describe("aws-sig", () => {
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
        const conf = Object.assign(Object.create(null), config);
        
        if(ignored.indexOf(name) > -1) {
            it.skip(`Skipping ${name}`);

            return;
        }

        if(name.includes("token")) {
            conf.sessionToken = token;
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
