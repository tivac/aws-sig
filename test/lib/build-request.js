"use strict";

var dedent = require("dedent");

module.exports = function(req) {
    const headers = [];

    Object.keys(req.headers).forEach((key) => {
        let values = req.headers[key];
        
        if(!Array.isArray(values)) {
            values = [ values ];
        }

        values.forEach((value) => headers.push(`${key}:${value}`));
    });
    
    let out = dedent(`
        ${req.method} ${req.uri} HTTP/1.1
        ${headers.join("\n")}
    `);
    
    if(req.body) {
        out += "\n\n";
        out += dedent(`
            ${req.body}
        `);
    }

    out += "\n";

    return out.replace(/\r\n/g, "\n");
};
