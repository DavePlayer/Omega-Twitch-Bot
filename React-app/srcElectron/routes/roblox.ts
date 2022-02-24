import express from "express";
import path from "path";
export const robloxRouter = express.Router();

robloxRouter.get("/roblox", (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`${__dirname}/../../../roblox-templates/default.html`));
});
