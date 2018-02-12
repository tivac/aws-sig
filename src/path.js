import encode from "strict-uri-encode"

const multipleSlashesRegex = /\/\/+/g;

export default ({ url }) => {
    return url.pathname
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
            
            prev.push(curr);

            return prev;
        }, [])
        .join("/");
};
