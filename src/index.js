"use strict";

import HmacSHA256 from "crypto-js/hmac-sha256";
import Sha256 from "crypto-js/sha256";

import query from "./query.js";
import headers from "./headers.js";
import path from "./path.js";

const _request = (req) => {
    const { method, url, body } = req;

    return [
        method ? method.toUpperCase() : "GET",
        
        // Canonical Path
        path(req),
        
        // Canonical Query
        query(req),
        
        // Canonical Headers
        headers(req),

        // Extra linebreak
        "",

        // Signed Headers
        Object.keys(req.headers).map((header) => header.toLowerCase()).join(";"),

        // Hashed payload
        Sha256(typeof body === "string" ? body.trim() : body).toString()
    ].join("\n");
};

const _stringToSign = ({ region, service, headers }, canonical) => {
    let datetime = "X-Amz-Date" in headers ? headers["X-Amz-Date"][0] : false;
    
    if(!datetime) {
        datetime = (new Date(headers.Date || headers.date || Date.now())).toISOString().replace(/[:\-]|\.\d{3}/g, "");
    }

    const [ date ] = datetime.split("T");

    return [
        "AWS4-HMAC-SHA256",
        // TODO: Date/time
        headers["X-Amz-Date"] || datetime,
        // TODO: Scope
        `${date}/${region}/${service}/aws4_request`,
        // TODO: Signed canonical request
        Sha256(canonical)
    ].join("\n");
};

const sign = (req, config) => {
    const args = Object.assign(
        Object.create(null),
        req,
        config,
        { url : new URL(req.url) }
    );

    const request = _request(args);

    console.log(request);
};

export { sign, _request, _stringToSign };
