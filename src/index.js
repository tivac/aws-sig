import request from "./request/request.js";
import { sorted, signed } from "./request/headers.js";
import stringToSign from "./stringtosign.js";
import signature from "./signature.js";

const dateCleanRegex = /[:\-]|\.\d{3}/g;

const requestRequired = [
    "url",
];

const configRequired = [
    "accessKeyId",
    "region",
    "secretAccessKey",
    "service",
];

// Check for required params
const validate = (source, config) => {
    if(!source) {
        throw new Error(`Missing request object`);
    }

    if(!config) {
        throw new Error(`Missing config object`);
    }

    let missing = requestRequired.filter((field) => !source[field]);

    if(missing.length) {
        throw new Error(`Missing required request fields: ${missing.join(", ")}`);
    }
    
    missing = configRequired.filter((field) => !config[field]);

    if(missing.length) {
        throw new Error(`Missing required config fields: ${missing.join(", ")}`);
    }
};

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

const authorization = (req, sig) => {
    const { algorithm, accessKeyId, date, region, service, sortedHeaders } = req;

    return [
        `${algorithm} Credential=${accessKeyId}/${date.short}/${region}/${service}/aws4_request`,
        `SignedHeaders=${signed(sortedHeaders)}`,
        `Signature=${sig}`,
    ].join(", ");
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
    if(ISTESTING) {
        source.test = {
            canonical,
            sts,
            auth,
        };
    }

    return source;
};
