const multipleSlashesRegex = /\/\/+/g;

export default ({ url }) => url.pathname
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
            
            prev.push(encodeURIComponent(curr));

            return prev;
        }, [])
        .join("/");
