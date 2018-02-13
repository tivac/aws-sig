import HmacSHA256 from "crypto-js/hmac-sha256";
import Sha256 from "crypto-js/sha256";

import request from "./request.js";
import stringToSign from "./stringtosign.js";

const sign = (source, config) => {
    const args = Object.assign(
        Object.create(null),
        source,
        config,
        { url : new URL(source.url) }
    );

    const canonical = request(args);
    const sts = stringToSign(args, canonical);
};

export { sign, request as _request, stringToSign as _stringToSign };
