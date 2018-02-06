"use strict";

import encode from "strict-uri-encode";
import HmacSHA256 from "crypto-js/hmac-sha256";
import Sha256 from "crypto-js/sha256";

const _canonical = ({ method, url, headers, body }) => {
    const params = [];
    const hkeys = headers ? Object.keys(headers) : [];
    
    url.searchParams.forEach((value, key) => {
        params.push([ key, value || "" ])
    });
    
    return [
        method ? method.toUpperCase() : "GET",
        
        // Canonical Path
        url.pathname.split("/").map(encode).join("/"),
        
        // Canonical Query
        params
            .sort(([ keya ], [ keyb ]) => keya < keyb)
            .map(([ key, value ]) => `${encode(key)}=${encode(value)}`)
            .join("&"),
        
        // Canonical Headers
        (hkeys.length
            ? hkeys
                .map((key) => `${key.toLowerCase()}:${headers[key].trim().replace(/\s+/g, " ")}`)
                .join("\n")
            : ""),
        "",
        // Signed Headers
        hkeys.map((header) => header.toLowerCase()).join(";"),

        // Hashed payload
        Sha256(JSON.stringify(body)).toString()
    ].join("\n");
};

const sign = (req, config) => {
    const args = Object.assign(Object.create(null), req, config, { url : new URL(req.url) });

    const request = _canonical(args);

    console.log(request);
};

export { sign, _canonical };
