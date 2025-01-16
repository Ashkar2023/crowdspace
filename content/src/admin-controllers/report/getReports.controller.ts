import { createUserBasicDict, injectProfiles, parseUniqueIds, ResponseCreator } from "@cr0wdspace/common";
import { Request } from "express";
import { ReportRepoImp } from "repositories/repositories.index.js";

export const getReports = async (req: Request) => {
    const { page, limit } = req.query as { limit: string, page: string };

    const result = await ReportRepoImp.getReports({
        limit: +limit,
        page: +page
    });

    const uniqueIds = parseUniqueIds(result.reports, 'reported_by');

    const { body, message } = await (
        await fetch(process.env.USER_SERVICE + "/basic",
            {
                method: "POST",
                body: JSON.stringify({
                    user_ids: Array.from(uniqueIds)
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    ).json();

    const profilesDict = createUserBasicDict(body.profiles);
    
    // replace with injectProfiles
    const reportsWithReporters = result.reports.map((report) => {
        report.reported_by = profilesDict[report.reported_by.toString()];
        return report;
    });
    
    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage(result.totalReports > 0 ? "reports fetched" : "reports empty")
        .setData({
            reports: reportsWithReporters,
            totalReports: result.totalReports
        })
        .get();
}
