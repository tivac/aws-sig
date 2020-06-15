import { signedHeaders } from "./signed-headers.js";
import { signedQuery } from "./signed-query.js";
import xamzdate from "./lib/header-x-amz-date.js";

export {
    signedHeaders,
    signedQuery,

    xamzdate as headerXAmzDate,
};
