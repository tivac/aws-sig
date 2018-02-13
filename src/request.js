import Sha256 from "crypto-js/sha256";

import query from "./query.js";
import headers from "./headers.js";
import path from "./path.js";

export default (req) => {
    const { method, url, body } = req;

    return [
        method ? method.toUpperCase() : "GET",
        
        // Canonical Path
        path(req),
        
        // Canonical Query
        query(req),
        
        // Canonical Headers
        headers(req),

        // Extra linebreak
        "",

        // Signed Headers
        Object.keys(req.headers).map((header) => header.toLowerCase()).join(";"),

        // Hashed payload
        Sha256(typeof body === "string" ? body.trim() : body).toString()
    ].join("\n");
};
