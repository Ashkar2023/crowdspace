import { truncate, writeFile } from "fs/promises";
import { createWriteStream, existsSync, PathLike } from "fs";
import morgan from "morgan";

const accessLogPath = new URL("../../logs/entry.log", import.meta.url);

// if(existsSync(accessLogPath)){
// await truncate(accessLogPath);
// await writeFile(accessLogPath,"\n");
// };

export const accessLogStream = createWriteStream(accessLogPath, { flags: "a" });

export default morgan("dev", { stream: accessLogStream });