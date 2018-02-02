"use strict";

module.exports = function parseReq(req) {
    const [ details, ...rest ] = req.toString("utf8").split("\n");

    // parsing POST / HTTP/1.1
    const [ _, method, uri ] = details.match(/(.+) (\/.*) HTTP/);
    const [ path, ...query ] = uri.split("?");

    // parsing headers
    let i = 0;
    const headers = [];

    while(i < rest.length && rest[i].length) {
        const [ key, ...value ] = rest[i].split(":");
        
        headers.push([
            key,
            value.join(":")
        ]);

        i++;
    }

    let body;
    if(rest.length > ++i) {
        body = rest.slice(i).join("\n");
    }

    return {
        method,
        url : new URL(`https://${headers.find(([ key, value ]) => key === "Host")[1]}${uri}`),
        uri,
        path,
        query : query.length ? query.join("?") : undefined,
        headers,
        body
    };
};
