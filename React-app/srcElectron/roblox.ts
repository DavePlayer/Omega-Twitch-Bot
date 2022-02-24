import express from "express";
import path from "path";

export const robloxWWW: express.Application = express();

// ejs
// robloxWWW.set("view engine", "ejs");
// robloxWWW.set("views", "roblox-templates");

robloxWWW.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`${__dirname}/../../roblox-templates/default.html`));
});
