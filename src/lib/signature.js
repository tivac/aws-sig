import hmacsha256 from "crypto-js/hmac-sha256.js";


// https://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html
export default ({ date, secretAccessKey, region, service }, sts) => {
    const kDate = hmacsha256(date.short, `AWS4${secretAccessKey}`);
    const kRegion = hmacsha256(region, kDate);
    const kService = hmacsha256(service, kRegion);
    const kSignature = hmacsha256("aws4_request", kService);

    return hmacsha256(sts, kSignature);
};
