"use strict";

const { URL } = require("url");

module.exports = function parseReq(req) {
    const [ details, ...rest ] = req.toString("utf8").split("\n");

    console.log(rest);

    // parsing POST / HTTP/1.1
    const [ _, method, uri ] = details.match(/(.+) (\/.*) HTTP/);
    const [ path, ...query ] = uri.split("?");

    console.log(uri, query);

    // parsing headers
    let i = 0;
    const headers = {};

    while(i < rest.length && rest[i].length) {
        const [ key, ...value ] = rest[i].split(":");
        
        headers[key] = value.join(":");

        i++;
    }

    // parsing body
    let body;
    if(rest.length > ++i) {
        body = rest.slice(i).join("\n");
    }

    return {
        method,
        url : new URL(`https://${headers.Host}}${uri}`),
        uri,
        path,
        query : query.length ? query.join("?") : undefined,
        headers,
        body
    };
};
