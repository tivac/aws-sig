const trim = (val) => val.trim().replace(/\s+/g, " ");

export default ({ headers }) => {
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
}
