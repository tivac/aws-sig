import { hmac } from "./encode.js";

export default ({ date, secretAccessKey, region, service }, sts) => {
    const kDate = hmac(date.short, `AWS4${secretAccessKey}`);
    const kRegion = hmac(region, kDate);
    const kService = hmac(service, kRegion);
    const kSignature = hmac("aws4_request", kService);

    return hmac(sts, kSignature);
};
