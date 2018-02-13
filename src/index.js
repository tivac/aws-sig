import request from "./request/request.js";
import { signed } from "./request/headers.js";
import stringToSign from "./stringtosign.js";
import signature from "./signature.js";

const dateCleanRegex = /[:\-]|\.\d{3}/g;

const date = ({ headers }) => {
    let datetime = "X-Amz-Date" in headers ?
        headers["X-Amz-Date"][0] :
        (new Date(headers.Date || Date.now())).toISOString().replace(dateCleanRegex, "");

    return {
        short : datetime.split("T")[0],
        long  : datetime
    };
};

const authorization = (req, sig) => {
    const { algorithm, accessKeyId, date, region, service } = req;

    return [
        `${algorithm} Credential=${accessKeyId}/${date.short}/${region}/${service}/aws4_request`,
        `SignedHeaders=${signed(req)}`,
        `Signature=${sig}`
    ].join(", ");
};

export default (source, config) => {
    const details = Object.assign(
        Object.create(null),
        source,
        config,
        {
            url       : new URL(source.url),
            algorithm : "AWS4-HMAC-SHA256",
            date      : date(source)
        }
    );

    const canonical = request(details);
    const sts = stringToSign(details, canonical);
    const sig = signature(details, sts);
    const auth = authorization(details, sig);

    /* START.TESTSONLY */
    // Add partial output to response for tests
    source.test = {
        canonical,
        sts,
        auth
    };
    /* END.TESTSONLY */

    if(!source.headers) {
        source.headers = {};
    }

    source.headers.Authorization = auth;
    source.headers["X-Amz-Date"] = details.date.long;

    if(config.sessionToken) {
        // source.headers["X-Amz-Security-Token"] = config.sessionToken;
    }

    return source;
};
