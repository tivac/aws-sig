import sha256 from "crypto-js/sha256.js";

const hash = (str) =>
    sha256(str).toString();

export { hash };
