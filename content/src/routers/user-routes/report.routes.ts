import { reportPost } from "@controllers/index.js";
import { createCallback } from "@cr0wdspace/common";
import { Router } from "express";

// prefixed with "/reports"

const reportRouter = Router();

reportRouter.post("/",createCallback(reportPost));

reportRouter.get("/")

reportRouter.put("/:report_id")

reportRouter.delete("/purge")

export default reportRouter