import { createHash } from "node:crypto"

export const create_ChatId_Hash = (...args: [string, string]) => {
    const sortedString = args.sort().join("");

    return createHash('sha256').update(sortedString).digest("base64url")
}
