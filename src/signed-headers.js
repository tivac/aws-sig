import { TEST } from "./environment.js";
import { signed } from "./request/headers.js";
import credential from "./lib/credential.js";

import sign from "./sign.js";

const authorization = (details) => {
    const {
        algorithm,
        sortedHeaders,
        signed : { signature },
    } = details;

    return [
        `${algorithm} Credential=${credential(details)}`,
        `SignedHeaders=${signed(sortedHeaders)}`,
        `Signature=${signature}`,
    ].join(", ");
};

// NO-OP
const before = (details) => details;

const after = (details) => {
    const auth = authorization(details);

    details.headers["X-Amz-Date"] = details.date.long;
    
    if(details.sessionToken) {
        details.headers["X-Amz-Security-Token"] = details.sessionToken;
    }
    
    details.headers.Authorization = auth;

    // Add partial output to response for tests so each step can be validated
    /* istanbul ignore next */
    if(TEST) {
        details.test.auth = auth;
    }

    return details;
};

const signedHeaders = (source, config) => sign(source, config, { before, after });

export {
    signedHeaders,
};
