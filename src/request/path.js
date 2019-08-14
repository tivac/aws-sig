import encode from "strict-uri-encode";

const multipleSlashesRegex = /\/\/+/g;

export default ({ url }) => {
    // URL() returns encoded values, so make sure to decode this first
    // since later we'll encode each path part individually
    const path = decodeURIComponent(url.pathname);

    return path
        .replace(multipleSlashesRegex, "/")
        .split("/")
        .map(encode)
        .join("/");
};
