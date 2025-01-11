import { createHash } from "node:crypto";

export const generateUrlSafeHash = (...args: [string, string]) => {

    return createHash('sha256')
        .update(args.join(""))
        .digest("base64")
        .replace(/[+/]/g, (match) => {
            return match === "+" ? "-" : "_";
        })
        .replace(/=+$/, "");
}