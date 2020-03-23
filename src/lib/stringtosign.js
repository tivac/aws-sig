import { hash } from "./hash.js";

// https://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html
export default ({ algorithm, date, region, service }, canonical) => [
        // Signing Function
        algorithm,
        
        // Date Time
        date.long,
        
        // Scope
        `${date.short}/${region}/${service}/aws4_request`,
        
        // Signed canonical request
        hash(canonical),
    ].join("\n");
