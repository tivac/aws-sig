const trim = (val) => {
    return val
        .toString()
        .trim()
        .replace(/\s+/g, " ");
};

const values = (headers) => {
    if(!headers.length) {
        return "";
    }

    return headers
        .map(([ key, vals ]) => {
            return `${key}:${Array.isArray(vals) ? vals.map(trim).join(",") : trim(vals)}`;
        })
        .join("\n");
};

const signed = (headers) => {
    return headers
        .map(([ key ]) => key)
        .join(";");
};

const sorted = ({ headers = {} }) => {
    const out = Object.keys(headers).map((key) => [ key.toLowerCase(), headers[key] ]);

    return out.sort(([ keya ], [ keyb ]) => keya.localeCompare(keyb));
};

export { sorted, values, signed };
