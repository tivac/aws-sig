import encode from "strict-uri-encode";

const multipleSlashesRegex = /\/\/+/g;

export default ({ url }) => {
    // URL() returns encoded values, so make sure to decode this first
    // since later we'll encode each path part individually
    const path = decodeURIComponent(url.pathname);

    return path
        .replace(multipleSlashesRegex, "/")
        .split("/")
        .reduce((prev, curr) => {
            if(curr === "..") {
                prev.pop();

                return prev;
            }
            
            if(curr === ".") {
                return prev;
            }
            
            // ensure all path parts are encoded, per sigv4 spec
            prev.push(encode(curr));

            return prev;
        }, [])
        .join("/");
};
