import { TEST } from "./environment.js";

import request from "./request/request.js";
import { sorted } from "./request/headers.js";
import stringToSign from "./lib/stringtosign.js";
import signature from "./lib/signature.js";
import validate from "./lib/validate.js";
import xamzdate from "./lib/header-x-amz-date.js";

const parseDate = ({ headers : { "X-Amz-Date" : amzdate, Date : date } }) => {
    const datetime = amzdate ?
        amzdate :
        xamzdate(date);

    return {
        short : datetime.split("T")[0],
        long  : datetime,
    };
};

// eslint-disable-next-line max-statements
const sign = (source, config, { before, after }) => {
    validate(source, config);

    if(!source.headers) {
        source.headers = {};
    }

    let details = Object.assign(
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

    details = before(details);

    const canonical = request(details);
    const sts = stringToSign(details, canonical);
    const sig = signature(details, sts);

    details.signed = {
        canonical,
        stringToSign,
        signature : sig,
    };

    // Add partial output to response for tests so each step can be validated
    /* istanbul ignore next */
    if(TEST) {
        details.test = {
            canonical,
            sts,
        };
    }
    
    details = after(details);

    const out = {
        url     : details.url.toString(),
        headers : details.headers,
        method  : details.method,
        body    : details.body,
    };

    /* istanbul ignore next */
    if(TEST) {
        out.test = details.test;
    }

    return out;
};

export default sign;
