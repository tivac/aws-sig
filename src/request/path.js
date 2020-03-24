import encode from "../lib/encode.js";

const multipleSlashesRegex = /\/\/+/g;

export default ({ service, url }) => {
    // S3 doesn't use normalized paths at all
    if(service === "s3") {
        return url.pathname;
    }
    
    return url.pathname
        .replace(multipleSlashesRegex, "/")
        .split("/")
        .map(encode)
        .join("/");
};
