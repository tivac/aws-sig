import encode from "../encode.js";

const multipleSlashesRegex = /\/\/+/g;

export default ({ url }) => url.pathname
    .replace(multipleSlashesRegex, "/")
    .split("/")
    .map(encode)
    .join("/");
