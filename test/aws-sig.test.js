"use strict";

const fs = require("fs");
const path = require("path");

const parse = require("./parse-request.js");
const build = require("./build-request.js");

const lib = require("../dist/aws-sig.cjs.js");

const specimens = fs.readdirSync("./test/specimens/aws-sig-v4-test-suite");

const config  = {
    region          : "us-east-1",
    service         : "service",
    accessKeyId     : "AKIDEXAMPLE",
    secretAccessKey : "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY",
    sessionToken    : "AQoDYXdzEPT//////////wEXAMPLEtc764bNrC9SAPBSM22wDOk4x4HIZ8j4FZTwdQWLWsKWHGBuFqwAeMicRXmxfpSPfIeoIYRqTflfKD8YUuwthAx7mSEI/qkPpKPi/kMcGdQrmGdeehM4IC1NtBmUpp2wUE8phUZampKsburEDy0KPkyQDYwT7WZ0wq5VSXDvp75YU9HFvlRd8Tx6q6fE8YQcHNVXAkiY9q6d+xo0rKwT38xVqr7ZD0u0iPPkUL64lIZbqBAz+scqKmlzm8FDrypNC9Yjc8fPOLn9FX9KSYvKTr4rvx3iSIlTJabIQwj2ICCR/oLxBA=="
};

describe("aws-sig", () => {
    const files = new Map();

    // Read all specimen files into memory
    specimens.forEach((test) => {
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

        files.set(test, out);
    });

    // Set up all the tests
    // files
    // [ files.get("get-vanilla") ]
    [ files.get("get-vanilla-query-order-key") ]
    .forEach((files, name) =>
        it(`${name} - canonical request`, () => {
            const req = parse(files.get("req"));

            console.log(req);

            expect(lib._canonical(req)).toEqual(files.get("creq"));
        })
    );
});
