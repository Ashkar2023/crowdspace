import { IUserController } from "@adapters/controllers/interfaces/user-controller.interface.js"
import { createCallback } from "@crowdspace/common"
import { Router } from "express"

export function buildUserRoutes({ router, UserController }: {
    router: Router,
    UserController: IUserController,
    middlewares: Record<string, any>
}) {
    /* place this route before the /:username route, or it will clash */
    router.get("/search", createCallback(UserController.search.bind(UserController)));
    
    router.get("/basic/:user_id", createCallback(UserController.getUserBasicProfile.bind(UserController))); // RBAC only for inter-services

    router.post("/basic", createCallback(UserController.getMultipleUsersBasicProfile.bind(UserController))); // RBAC only for inter-services

    router.get("/:username", createCallback(UserController.getUserProfile.bind(UserController)))

    router.post("/:user_id/follow", createCallback(UserController.followUser.bind(UserController)))

    router.delete("/:user_id/follow", createCallback(UserController.unfollowUser.bind(UserController)))

    router.get("/:user_id/follows", createCallback(UserController.getFollows.bind(UserController))); // remove

    router.get("/:user_id/followers", createCallback(UserController.getFollowers.bind(UserController)));

    router.get("/:user_id/followings", createCallback(UserController.getFollowings.bind(UserController)));

    router.delete("/followers/:follower_id", createCallback(UserController.removeFollower.bind(UserController)))

    return router
}