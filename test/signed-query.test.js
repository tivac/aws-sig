"use strict";

const config = require("./lib/config.js");

const { signedQuery : query } = require("../src/aws-sig.js");

describe("aws-sig signedQuery", () => {
    it("should support signature params", () => {
        expect(query({
            url : `wss://n98jarys75.execute-api.us-east-1.amazonaws.com/test`,
        }, config())).toMatchSnapshot();
    });
    
    it("should support signature params in the query with an already-existing query string", () => {
        expect(query({
            url : `wss://n98jarys75.execute-api.us-east-1.amazonaws.com/test?fooga=wooga&booga=tooga`,
        }, config())).toMatchSnapshot();
    });
    
    it("should support session tokens", () => {
        expect(query({
            url : `wss://n98jarys75.execute-api.us-east-1.amazonaws.com/test`,
        }, config({
            sessionToken : "I-AM-THE-WALRUS-KOO-KOO-KACHOO",
        }))).toMatchSnapshot();
    });
});
