import express from "express";
import fs from "fs";
import path from "path";
import { appPath, window } from "../../main";
import { sound } from "../../src/Components/Shortcuts";
import { globalShortcut } from "electron";
export const soundsRouter = express.Router();

export const writeSoundJson = (json?: Array<sound>, callback?: () => void) => {
    fs.writeFileSync(path.join(appPath(), "sounds.json"), JSON.stringify(json ? json : []));
    if (callback) callback();
};

export const loadSounds = () =>
    new Promise<Array<sound>>((res, rej) => {
        if (fs.existsSync(path.join(appPath(), "sounds.json"))) {
            const file = fs.readFileSync(path.join(appPath(), "sounds.json"), "utf-8");
            const json: Array<sound> = JSON.parse(file);
            res(json);
        } else {
            rej({
                status: 404,
                error: "no sounds found",
            });
        }
    });
let loadedSounds: Array<sound> = [];
let isPlaying: boolean = false;
let exec = require("child_process").exec;

export const mapSounds = (action?: string) => {
    switch (action) {
        case "reload":
            globalShortcut.unregisterAll();
            mapSounds("load");
            break;
        case "load":
        default:
            loadSounds()
                .then((sounds) => (loadedSounds = sounds))
                .then(() =>
                    loadedSounds.map((sound: sound) => {
                        globalShortcut.register(sound.keyBinding, () => {
                            console.log(sound.keyBinding);
                            if (isPlaying == false) {
                                // console.log(`mpv ${sound.soundPath} --volume=${sound.volume}`);
                                // const cmd = exec(`mpv ${sound.soundPath} --volume=${sound.volume}`);
                                // cmd.stdout.on("data", function (data: any) {
                                //     console.log(data.toString());
                                // });
                                // window.webContents.send("timer:console", `started playing sound`);
                                // // what to do with data coming from the standard error
                                // cmd.stderr.on("data", function (data: any) {
                                //     console.log(data.toString());
                                //     // window.webContents.send(
                                //     //     "timer:console",
                                //     //     data.toString()
                                //     // );
                                // });
                                // // what to do when the command is done
                                // cmd.on("exit", function (code: any) {
                                //     console.log("program ended with code: " + code);
                                //     window.webContents.send("timer:console", `Ended playing sound ${code}`);
                                // });
                                playSound(sound.soundPath);
                            }
                        });
                    })
                )
                .catch((err) => console.log(err));
            break;
    }
};
export const playSound = (link: string) => {
    window.webContents.send("timer:console", `started playing sound: <b>${link}</b>`);
    window.webContents.send("sound::playSound", link);
};

soundsRouter.get("/sounds", (req: express.Request, res: express.Response) => {
    console.log("some send request for sounds json");
    loadSounds()
        .then((sounds) => res.json(sounds))
        .catch((err) => res.status(err.status).json(err.error));
});

soundsRouter.post("/sounds", (req: express.Request, res: express.Response) => {
    console.log("uploading new sound");
    console.log("body: ", req.body);
    console.log(`files: `, req.files);
    // These files don't have proper types, so i had to do that
    const thumbnailFile: any = req.files.thumbnail;
    const soundFile: any = req.files.sound;
    thumbnailFile.name = String(thumbnailFile.name)
        .replace(/[^a-zA-Z-1-9-. ]/g, "")
        .replace(/\s+/g, "-");
    soundFile.name = String(soundFile.name)
        .replace(/[^a-zA-Z-1-9-. ]/g, "")
        .replace(/\s+/g, "-");

    fs.writeFile(path.join(appPath(), "thumbnails", thumbnailFile.name), thumbnailFile.data, (err) => {
        if (err) throw err;
        else {
            window.webContents.send("timer:console", `created ${thumbnailFile.name} file`);
        }
    });
    fs.writeFile(path.join(appPath(), "sounds", soundFile.name), soundFile.data, (err) => {
        if (err) throw err;
        else {
            window.webContents.send("timer:console", `created ${soundFile.name} file`);
        }
    });
    const file = fs.readFileSync(path.join(appPath(), "sounds.json"), "utf-8");
    let json: Array<sound> = JSON.parse(file);
    json = [
        ...json,
        {
            name: req.body.name,
            keyBinding: req.body.shortcut,
            soundPath: path.join(appPath(), "sounds", soundFile.name.replace(/\s+/g, "-").replace(/\s+/g, "-")),
            thumbnailPath: path.join(
                appPath(),
                "thumbnails",
                thumbnailFile.name.replace(/\s+/g, "-").replace(/\s+/g, "-")
            ),
            volume: 99,
            duration: soundFile.data.duration,
        },
    ];
    writeSoundJson(json, () => mapSounds("reload"));
    res.json({
        status: "OK",
    });
});
