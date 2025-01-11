import { Types } from "mongoose"

type Participants = Types.ObjectId[] | string;

export const parseReceiverId = (participants: Participants, userId: string): string => {
    console.log(typeof participants)
    let userIdArray: string[] = [];

    if (typeof participants === "string") {
        userIdArray = JSON.parse(participants);
    } else if (Array.isArray(participants)) {
        userIdArray = participants.map(oid => oid.toString());
    }

    return userIdArray.filter(v => v !== userId)[0];
}
