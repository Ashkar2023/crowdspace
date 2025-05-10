import { IUserControllerFacade } from "@adapters/controllers/interfaces/ifacade/user-controller-facade.interface.js";
import { IUserController } from "@adapters/controllers/interfaces/user-controller.interface.js"
import { createCallback } from "@cr0wdspace/common"
import { Router } from "express"

export function buildUserRoutes({ router, UserController }: {
    router: Router,
    UserController: IUserControllerFacade,
    middlewares: Record<string, any>
}) {
    router.get("/search", createCallback(UserController.search.bind(UserController)));
    
    router.get("/status-connection", createCallback(UserController.getAccountStatusAndConnection.bind(UserController))) // RBAC only for inter-services
    
    router.get("/basic/:user_id", createCallback(UserController.getUserBasicProfile.bind(UserController))); // RBAC only for inter-services

    router.post("/basic", createCallback(UserController.getMultipleUsersBasicProfile.bind(UserController))); // RBAC only for inter-services

    router.post("/:user_id/follow", createCallback(UserController.followUser.bind(UserController)))
    
    router.delete("/:user_id/follow", createCallback(UserController.unfollowUser.bind(UserController)))
    
    router.patch("/:follow_doc_id/accept", createCallback(UserController.acceptFollowRequest.bind(UserController)));
    
    router.get("/:user_id/followers", createCallback(UserController.getFollowers.bind(UserController)));
    
    router.get("/:user_id/followings", createCallback(UserController.getFollowings.bind(UserController)));
    
    router.delete("/followers/:follower_id", createCallback(UserController.removeFollower.bind(UserController)))
    
    // place this route last, routes with a single route segment for ex: '/search' will be caught by this router if placed before those routes 
    router.get("/:username", createCallback(UserController.getUserProfile.bind(UserController)))

    return router
}