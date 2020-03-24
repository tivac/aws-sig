import { hmac } from "./hash.js";

// https://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html
export default ({ date, secretAccessKey, region, service }, sts) => {
    const kDate = hmac(date.short, `AWS4${secretAccessKey}`);
    const kRegion = hmac(region, kDate);
    const kService = hmac(service, kRegion);
    const kSignature = hmac("aws4_request", kService);

    return hmac(sts, kSignature);
};
