import Sha256 from "crypto-js/sha256";

export default ({ region, service, headers }, canonical) => {
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
