import express from "express";
import cors from "cors";
import upload from "express-fileupload";
import path from "path";
import { Stream } from "stream";
import fs from "fs";
import { soundsRouter } from "./routes/sounds";
import { robloxRouter } from "./routes/roblox";

export const WebServer: express.Application = express();
WebServer.use(cors());
WebServer.use(express.json());
WebServer.use(upload());
WebServer.use(soundsRouter);
WebServer.use(robloxRouter);

WebServer.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`${__dirname}/../obs_html/index.html`));
});

WebServer.get("/getImage", (req: express.Request, res: express.Response) => {
    console.log(req.query);
    //res.sendFile(req.query.path as string);
    const r = fs.createReadStream(req.query.path as string); // or any other way to get a readable stream
    const ps = new Stream.PassThrough(); // <---- this makes a trick with stream error handling
    Stream.pipeline(
        r,
        ps, // <---- this makes a trick with stream error handling
        (err) => {
            if (err) {
                console.log(err); // No such file or any other kind of error
                return res.sendStatus(400);
            }
        }
    );
    ps.pipe(res); // <---- this makes a trick with stream error handling
});
