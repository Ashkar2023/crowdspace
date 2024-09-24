import { connect, disconnect } from "mongoose";
import { styleText } from "node:util";

// export async function connectDb(url: string) {
export async function connectDb(url:string) {
    if (url) {
        connect(url)
            .then(() => {
                console.log(styleText("blue", "=> User DB : Connected."))
            })
            .catch((err) => {
                console.log(styleText("yellow", "=> User DB : "))
                console.log(styleText("yellow",err.message));
                process.exit(0)
            })
    } else {
        console.log(styleText("red", '\n => User-service DB : url missing'))
    }
}

export async function closeDb() {
    try {
        await disconnect();
        console.log("=> User DB : disconnected ")
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('=> An unknown error occurred when closing DB');
        }
    }
}