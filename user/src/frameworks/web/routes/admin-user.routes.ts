import { IAdminUserControllerFacade } from "@adapters/controllers/interfaces/ifacade/admin-user-controller-facade.interface.js";
import { createCallback, UnauthorizedError } from "@crowdspace/common";
import { NextFunction, Request, Response, Router } from "express";

export function buildAdminUserRouter({
    router,
    adminUserController,
    // middlewares
}: {
    router: Router,
    adminUserController: IAdminUserControllerFacade,
    // middlewares: Record<string, RequestHandler>
}) {

    // CHANGE admin middleware
    router.use((req: Request, res: Response, next: NextFunction) => {
        if(!req.session.user) throw new UnauthorizedError("Session not found",401,undefined,"invalid_session");
        else next(); 
    })

    router.post("/users", createCallback(adminUserController.getUsers.bind(adminUserController)));

    router.patch("/user/:userId/ban",createCallback(adminUserController.banUser.bind(adminUserController)))
    
    router.patch("/user/:userId/unban",createCallback(adminUserController.unbanUser.bind(adminUserController)))

    return router;
}