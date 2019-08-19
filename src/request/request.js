import { hash } from "../hash.js";

import query from "./query.js";
import { values, signed } from "./headers.js";
import path from "./path.js";

export default (req) => {
    const { method, body, sortedHeaders } = req;

    // https://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html
    return [
        method.toUpperCase(),
        
        // Canonical Path
        path(req),
        
        // Canonical Query
        query(req),
        
        // Canonical Headers
        values(sortedHeaders),

        // Extra linebreak
        "",

        // Signed Headers
        signed(sortedHeaders),

        // Hashed payload
        hash(typeof body === "string" ? body.trim() : body),
    ].join("\n");
};
