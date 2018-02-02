"use strict";

const fs = require("fs");
const path = require("path");

const parse = require("./parse-request.js");
const build = require("./build-request.js");

const lib = require("../src/index.js");

const specimens = fs.readdirSync("./test/specimens/aws-sig-v4-test-suite");

const config  = {
    region : "us-east-1",
    service : "service",
    accessKeyId : "AKIDEXAMPLE",
    secretAccessKey : "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY",
    sessionToken : "AQoDYXdzEPT//////////wEXAMPLEtc764bNrC9SAPBSM22wDOk4x4HIZ8j4FZTwdQWLWsKWHGBuFqwAeMicRXmxfpSPfIeoIYRqTflfKD8YUuwthAx7mSEI/qkPpKPi/kMcGdQrmGdeehM4IC1NtBmUpp2wUE8phUZampKsburEDy0KPkyQDYwT7WZ0wq5VSXDvp75YU9HFvlRd8Tx6q6fE8YQcHNVXAkiY9q6d+xo0rKwT38xVqr7ZD0u0iPPkUL64lIZbqBAz+scqKmlzm8FDrypNC9Yjc8fPOLn9FX9KSYvKTr4rvx3iSIlTJabIQwj2ICCR/oLxBA=="
};

function validate(files, name) {
    it(`${name} - blah`, () => {
        expect(typeof files.get("req")).toEqual("string");
    });
}

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
                )
            );
        });

        files.set(test, out);
    });

    files.forEach(validate);
});
