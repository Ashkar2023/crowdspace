import app from "@frameworks/web/app.js";
import { styleText } from "node:util";


app.listen(process.env.PORT, () => {
    console.log(styleText("magentaBright","\nUser-Service started"),styleText("yellow",`http://localhost:${process.env.PORT}`));
})
