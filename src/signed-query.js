import { sorted } from "./request/headers.js";
import encode from "./lib/encode.js";
import credential from "./lib/credential.js";

import sign from "./sign.js";

const before = (details) => {
    const { url } = details;

    // Query param signatures always have a host header
    details.headers.host = url.host;

    // Need to update sortedHeaders after shoving in a host header
    details.sortedHeaders = sorted(details);

    const query = [
        [ "X-Amz-Algorithm", details.algorithm ],
        [ "X-Amz-Credential", credential(details) ],
        [ "X-Amz-Date", details.date.long ],

        details.sessionToken ?
            [ "X-Amz-Security-Token", details.sessionToken ] :
            false,

        [ "X-Amz-SignedHeaders", details.sortedHeaders.map(([ header ]) => header).join(",") ],
    ]
    .filter(Boolean)
    .map(([ key, value ]) => `${key}=${encode(value)}`)
    .join("&");

    url.search = url.search.length ?
        `${url.search}&${query}` :
        query;
    
    return details;
};

const after = (details) => {
    const { url, signed } = details;

    const sigparam = `X-Amz-Signature=${encode(signed.signature)}`;

    url.search = `${url.search}&${sigparam}`;

    details.url = url.toString();

    return details;
};

const signedQuery = (source, config) => sign(source, config, { before, after });

export {
    signedQuery,
};
