"use strict";

var dedent = require("dedent");

module.exports = function(output, { _uri }) {
    const headers = Object.keys(output.headers).reduce((acc, key) => {
        let values = output.headers[key];
        
        if(!Array.isArray(values)) {
            values = [ values ];
        }

        const sep = key === "Authorization" ? ": " : ":";

        values.forEach((value) => acc.push(`${key}${sep}${value}`));

        return acc;
    }, []);

    let text = dedent(`
        ${output.method} ${_uri} HTTP/1.1
        ${headers.join("\n")}
    `);
    
    if(output.body) {
        text += "\n\n";
        text += dedent(`
            ${output.body}
        `);
    }

    return text.replace(/\r\n/g, "\n");
};
