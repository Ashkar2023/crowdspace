import { createWriteStream, existsSync, mkdirSync } from "fs";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const accessLogPath = new URL("../../logs/entry.log", import.meta.url);
const accessLogDirPath = path.dirname(fileURLToPath(accessLogPath));

try {
    console.log(accessLogDirPath)
    console.log(!existsSync(accessLogDirPath));

    if (!existsSync(accessLogDirPath)) {
        mkdirSync(accessLogDirPath, { recursive: true });
    }
} catch (error) {
    console.log((error as Error).message)
}

export const accessLogStream = createWriteStream(accessLogPath, { flags: "a" });

export default morgan("dev", { stream: accessLogStream });