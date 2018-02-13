import Sha256 from "crypto-js/sha256";

// https://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html
export default ({ algorithm, date, region, service }, canonical) => {
    return [
        // Signing Function
        algorithm,
        
        // Date Time
        date.long,
        
        // Scope
        `${date.short}/${region}/${service}/aws4_request`,
        
        // Signed canonical request
        Sha256(canonical)
    ].join("\n");
};
