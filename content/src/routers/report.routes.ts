import { createCallback } from "@crowdspace/common";
import { Router } from "express";

const reportRouter = Router();

reportRouter.post("/",createCallback());

// reportRouter.delete("/")

reportRouter.get("/")

reportRouter.put("/:report_id")

export default reportRouter