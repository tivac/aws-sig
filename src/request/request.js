import { hash } from "../encode.js";

import query from "./query.js";
import { values, signed } from "./headers.js";
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
        values(req),

        // Extra linebreak
        "",

        // Signed Headers
        signed(req),

        // Hashed payload
        hash(typeof body === "string" ? body.trim() : body)
    ].join("\n");
};
