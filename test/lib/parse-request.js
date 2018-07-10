"use strict";

const { URL } = require("url");

module.exports = function parseReq(req) {
    const [ details, ...rest ] = req.toString("utf8").split("\n");

    // parsing POST / HTTP/1.1
    const [ , method, uri ] = details.match(/(.+) (\/.*) HTTP/);
    const [ path, ...query ] = uri.split("?");

    // parsing headers
    let i = 0;
    const headers = {};

    while(i < rest.length && rest[i].length) {
        const [ key, ...value ] = rest[i].split(":");
        
        if(!headers[key]) {
            headers[key] = [];
        }

        headers[key].push(value.join(":"));

        i++;
    }

    // Flatten one-item headers because no one wants to call them as an array...
    Object.keys(headers).forEach((key) => {
        if(headers[key].length !== 1) {
            return;
        }

        headers[key] = headers[key][0];
    });

    // parsing body
    let body;

    if(rest.length > ++i) {
        body = rest.slice(i).join("\n");
    }

    return {
        method,
        url     : new URL(`https://${headers.Host}}${uri}`),
        uri,
        path,
        query   : query.length ? query.join("?") : undefined,
        headers,
        region  : "us-east-1",
        service : "service",
        body,
    };
};
