import { IUserController } from "@adapters/controllers/interfaces/user-controller.interface.js"
import { createCallback } from "@crowdspace/common"
import { Router } from "express"

export function buildUserRoutes({ router, UserController }: {
    router: Router,
    UserController: IUserController,
    middlewares: Record<string, any>
}) {

    router.get("/:username", createCallback(UserController.getUserProfile.bind(UserController)))

    router.post("/:user_id/follow", createCallback(UserController.followUser.bind(UserController)))

    router.delete("/:user_id/follow", createCallback(UserController.unfollowUser.bind(UserController)))

    router.get("/:user_id/follows", createCallback(UserController.getFollows.bind(UserController)));

    return router
}