"use strict";

// var dedent = require("dedent");

module.exports = function(req) {
    let out = /*dedent(*/`
        ${req.method} ${req.uri} HTTP/1.1
        ${req.headers.map(([ key, value ]) => `${key}:${value}`).join("\n")}
    `;//);
    
    if(req.body) {
        out += /*dedent(*/`
        
            ${req.body}
        `;//);
    }

    out += '\n';

    return out.replace(/\r\n/g, "\n");
};
