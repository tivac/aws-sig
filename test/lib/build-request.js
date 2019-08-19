"use strict";

var dedent = require("dedent");

module.exports = function(req) {
    const headers = [];

    Object.keys(req.headers).forEach((key) => {
        let values = req.headers[key];
        
        if(!Array.isArray(values)) {
            values = [ values ];
        }

        const sep = key === "Authorization" ? ": " : ":";

        values.forEach((value) => headers.push(`${key}${sep}${value}`));
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

    return out.replace(/\r\n/g, "\n");
};
