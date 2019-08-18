"use strict";

// Replace one extra character beyond what encodeURIComponent does, "*"
// See https://github.com/aws/aws-sdk-js/blob/38bf84c144281f696768e8c64500f2847fe6f298/lib/util.js#L39-L49
const encode = (str) =>
    encodeURIComponent(str)
    .replace(/[*]/g, (x) =>
        // eslint-disable-next-line newline-per-chained-call
        `%${x.charCodeAt(0).toString(16).toUpperCase()}`
    );

export default encode;
