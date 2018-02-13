import Sha256 from "crypto-js/sha256";
import HmacSHA256 from "crypto-js/hmac-sha256";

const hash = (str) =>
    Sha256(str).toString();

const hmac = HmacSHA256;
    
export { hmac, hash };
