import { connect, disconnect } from "mongoose";
import { styleText } from "node:util";

export async function connectDb(url: string) {
    if (url) {
        connect(url)
            .then(() => {
                console.log(styleText("green", "\nUser DB : Connected."))
            })
            .catch((err) => {
                console.log(styleText("red", "\nUser DB : "))
                console.log(styleText("yellow",err.message));
            })
    } else {
        console.log(styleText("red", '\nUser DB : url missing'))
    }
}

connectDb("ssd")

export async function closeDb() {
    try {
        await disconnect();
        console.log("User DB : disconnected ")
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('An unknown error occurred when closing DB');
        }
    }
}