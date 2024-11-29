import { IProfileController } from "@adapters/controllers/interfaces/profile-controller.interface.js"
import { IProfileUpdateController } from "@adapters/controllers/interfaces/profile-update-controller.interface.js"
import { createCallback } from "@crowdspace/common"
import { Router } from "express"

export function buildUserRoutes({ router, UserController }: {
    router: Router,
    UserController: IProfileController,
    middlewares: Record<string, any>
}) {

    router.get("/:username", createCallback(UserController.getUserProfile.bind(UserController)))

    return router
}