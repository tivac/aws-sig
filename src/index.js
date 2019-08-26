import testing from "consts:testing";

import request from "./request/request.js";
import { sorted } from "./request/headers.js";
import stringToSign from "./stringtosign.js";
import signature from "./signature.js";
import validate from "./validate.js";
import authorization from "./authorization.js";

const dateCleanRegex = /[:\-]|\.\d{3}/g;

const parseDate = ({ headers }) => {
    const datetime = "X-Amz-Date" in headers ?
        headers["X-Amz-Date"] :
        (new Date(headers.Date || Date.now()))
            .toISOString()
            .replace(dateCleanRegex, "");

    return {
        short : datetime.split("T")[0],
        long  : datetime,
    };
};

export default (source, config) => {
    validate(source, config);

    if(!source.headers) {
        source.headers = {};
    }

    const details = Object.assign(
        Object.create(null),
        {
            method : "GET",
        },
        source,
        config,
        {
            url           : new URL(source.url),
            algorithm     : "AWS4-HMAC-SHA256",
            date          : parseDate(source),
            sortedHeaders : sorted(source),
        }
    );

    const canonical = request(details);
    const sts = stringToSign(details, canonical);
    const sig = signature(details, sts);
    const auth = authorization(details, sig);

    source.headers["X-Amz-Date"] = details.date.long;
    
    if(config.sessionToken) {
        source.headers["X-Amz-Security-Token"] = config.sessionToken;
    }
    
    source.headers.Authorization = auth;

    // Add partial output to response for tests so each step can be validated
    /* istanbul ignore next */
    if(testing) {
        source.test = {
            canonical,
            sts,
            auth,
        };
    }

    return source;
};
