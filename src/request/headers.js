const trim = (val) => val.trim().replace(/\s+/g, " ");

const values = ({ headers }) => {
    const keys = Object.keys(headers);
    
    if(!keys.length) {
        return "";
    }

    return keys
        .map((key) => {
            const vals = headers[key];

            return `${key.toLowerCase()}:${Array.isArray(vals) ? vals.map(trim).join(",") : trim(vals)}`;
        })
        .join("\n");
};

const signed = ({ headers }) =>
    Object.keys(headers).map((header) => header.toLowerCase()).join(";");

export { values, signed };
