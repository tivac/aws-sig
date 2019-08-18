/* eslint-disable new-cap */
import { SHA256, HmacSHA256 } from "./crypto-es/sha256.js";

const hash = (str) =>
    SHA256(str).toString();

const hmac = HmacSHA256;
    
export { hmac, hash };
