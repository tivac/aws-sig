import { signed } from "./request/headers.js";

const authorization = (req, sig) => {
    const {
        algorithm,
        accessKeyId,
        date,
        region,
        service,
        sortedHeaders,
    } = req;

    return [
        `${algorithm} Credential=${accessKeyId}/${date.short}/${region}/${service}/aws4_request`,
        `SignedHeaders=${signed(sortedHeaders)}`,
        `Signature=${sig}`,
    ].join(", ");
};

export default authorization;
