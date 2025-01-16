import { createUserBasicDict, injectProfiles, parseUniqueIds, ResponseCreator } from "@cr0wdspace/common";
import { Request } from "express";
import { NotificationRepoImp } from "../../repositories/repositories.index.js";

export const getAllNotifications = async (req: Request) => {
    const loggedInUser = req.headers["x-logged-in-user"] as string;

    const notifications = await NotificationRepoImp.getAllNotifications(loggedInUser);

    const uniqueIdSet = parseUniqueIds(notifications, "actor");

    const { body, message } = await (
        await fetch(process.env.USER_SERVICE + "/basic",
            {
                method: "POST",
                body: JSON.stringify({
                    user_ids: Array.from(uniqueIdSet)
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    ).json();

    const profileDict = createUserBasicDict(body.profiles);

    const NotificationsWithProfiles = injectProfiles(notifications, profileDict, "actor")

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("notifications fetched")
        .setData({ notifications: NotificationsWithProfiles, count: notifications.length })
        .get();
}