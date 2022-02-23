import electron, { globalShortcut, session } from "electron";
import path from "path";
import express from "express";
import SocketIO from "socket.io";
import cors from "cors";
import tmi from "tmi.js";
import dotenv from "dotenv";
import fs from "fs";
import { existsSync } from "original-fs";
import upload from "express-fileupload";
import { sound } from "./src/Components/Shortcuts";
import { Stream } from "stream";
import * as googleTTS from "google-tts-api";
import fetch from "node-fetch";
import mp3Duration from "mp3-duration";
dotenv.config();
let exec = require("child_process").exec;
//require("electron-reload")(process.cwd());

const WebServer: express.Application = express();
const robloxWWW: express.Application = express();
WebServer.use(cors());
WebServer.use(express.json());
WebServer.use(upload());

robloxWWW.set("view engine", "ejs");
robloxWWW.set("views", "roblox-templates");

robloxWWW.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`${__dirname}/../roblox-templates/default.html`));
});

WebServer.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`${__dirname}/obs_html/index.html`));
});

WebServer.get("/sounds", (req: express.Request, res: express.Response) => {
    console.log("some send request for sounds json");
    loadSounds()
        .then((sounds) => res.json(sounds))
        .catch((err) => res.status(err.status).json(err.error));
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

WebServer.post("/sounds", (req: express.Request, res: express.Response) => {
    console.log("uploading new sound");
    console.log("body: ", req.body);
    console.log(`files: `, req.files);
    // These files don't have proper types, so i had to do that
    const thumbnailFile: any = req.files.thumbnail;
    const soundFile: any = req.files.sound;
    thumbnailFile.name = String(thumbnailFile.name)
        .replace(/[^a-zA-Z0-9-. ]/g, "")
        .replace(/\s+/g, "-");
    soundFile.name = String(soundFile.name)
        .replace(/[^a-zA-Z0-9-. ]/g, "")
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
            volume: 100,
            duration: soundFile.data.duration,
        },
    ];
    writeSoundJson(json, () => mapSounds("reload"));
    res.json({
        status: "OK",
    });
});

const http = require("http").createServer();
const wws: SocketIO.Server = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});
//const wws = new WebSocket.Server({server: require('http').createServer(WebServer)})

wws.on("connection", (socket: SocketIO.Socket) => {
    console.log("new client connected");
    socket.send("connection confirmed");

    socket.on("timer:update", () => {
        console.log("updated clock");
    });
    socket.on("timer:console", (message) => {
        console.log(message);
    });
    socket.on("timer:cheer", (cheer) => {
        console.log("cheer granted", cheer);
    });
});

let clientTwitch: tmi.Client = new tmi.Client({
    options: {
        debug: true,
    },
    connection: {
        secure: true,
        reconnect: true,
        //server: 'irc.fdgt.dev',
    },
    identity: {
        username: process.env.USERNAME,
        password: process.env.TWITCH_KEY,
    },
    channels: [process.env.USERNAME as string],
});

clientTwitch
    .connect()
    .then(() => {
        console.log("connected");
        window.webContents.send("timer:console", `pomyślnie połączono z czatem`);
        //setTimeout(() => {
        //    clientTwitch.say(process.env.USERNAME as string, 'bits --bitscount 500 Woohoo!')
        //}, 10000)
    })
    .catch((err) => {
        console.log(err);
        window.webContents.send("timer:console", `${err}`);
    });

// testing by chat because can't test cheers
/*clientTwitch.on("message", (channel:any, userstate:any, message:any, self:any) => {
    const bits = parseInt(message)

    if(isNaN(bits) != true) {
        wws.emit('timer:cheer', bits)
    }
})*/
clientTwitch.on("connected", () => {
    console.log("connected properly");
    clientTwitch.say(process.env.USERNAME as string, "pomyślnie połączono z czatem");
    //window.webContents.send('timer:console', `pomyślnie połączono z czatem`)
});

clientTwitch.on("cheer", (channel: any, userstate: tmi.Userstate, message: any) => {
    // Do your stuff.
    console.log(userstate.bits, "-------------");
    //clientTwitch.say(process.env.USERNAME as string, `Ktoś dał donate ${userstate.bits}, więc daj znać dave, że twitch dobrze podaje cheersy`)
    wws.emit("timer:cheer", userstate.bits);
    window.webContents.send("timer:console", `someone cheered ${userstate.bits} bits`);
});

const { app, BrowserWindow, ipcMain } = electron;

// process.env.NODE_ENV = 'production'

let window: electron.BrowserWindow;

const appPath = () => {
    switch (process.platform) {
        case "darwin": {
            return path.join(process.env.HOME, "Library", "Application Support", "omega");
        }
        case "win32": {
            return process.env.APPDATA + "\\omega";
        }
        case "linux": {
            return process.env.HOME + "/.omega";
        }
    }
};

const writeSoundJson = (json?: Array<sound>, callback?: () => void) => {
    fs.writeFileSync(path.join(appPath(), "sounds.json"), JSON.stringify(json ? json : []));
    if (callback) callback();
};

const loadSounds = () =>
    new Promise<Array<sound>>((res, rej) => {
        if (fs.existsSync(path.join(appPath(), "sounds.json"))) {
            const file = fs.readFileSync(path.join(appPath(), "sounds.json"), "utf-8");
            const json: Array<sound> = JSON.parse(file);
            console.log(json);
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
const mapSounds = (action?: string) => {
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
                                console.log(`mpv ${sound.soundPath} --volume=${sound.volume}`);
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
const playSound = (link: string) => {
    window.webContents.send("timer:console", `started playing sound: <b>${link}</b>`);
    window.webContents.send("sound::playSound", link);
};

app.on("ready", () => {
    console.log(appPath());
    //registering shourtcuts even when app is not focused
    globalShortcut.register("Control + Alt + v", () => console.log("ztrl+alt+v"));
    window = new BrowserWindow({
        width: 800,
        height: 550,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        },
    });
    window.loadURL(`file://${__dirname}/src/index.html`);
    if (!existsSync(appPath())) {
        fs.mkdir(appPath(), (err) => {
            if (err) throw err;
            console.log("created .omega");
            window.webContents.send("timer:console", `created ${appPath()}`);
            fs.mkdir(path.join(appPath(), "thumbnails"), (err) => {
                if (err) throw err;
                console.log("created thumbnails folder");
                window.webContents.send("timer:console", `created ${path.join(appPath(), "thumbnails")}`);
            });
            fs.mkdir(path.join(appPath(), "sounds"), (err) => {
                if (err) throw err;
                console.log("created sounds folder");
                window.webContents.send("timer:console", `created ${path.join(appPath(), "sounds.json")}`);
            });
        });
        writeSoundJson();
    } else {
        console.log(".omega already exist");
        window.webContents.send("timer:console", `omega already exist`);
        mapSounds();
    }
});

ipcMain.on("timer:updateClock", (e, clock) => {
    console.log(clock);
    wws.emit("timer:update", clock);
    window.webContents.send("timer:console", `Timer updated`);
});
ipcMain.on("timer:updateFont", (e, font) => {
    console.log(font);
    wws.emit("timer:font", font.fontSize);
    window.webContents.send("timer:console", `Font Changed`);
});
ipcMain.on("app:close", () => {
    app.quit();
});
ipcMain.on("app:updateConfig", (e, token, username) => {
    process.env.TWITCH_KEY = token;
    process.env.USERNAME = username;
    console.log(token, username);
    clientTwitch = new tmi.Client({
        options: {
            debug: true,
        },
        connection: {
            secure: true,
            reconnect: true,
        },
        identity: {
            username: process.env.USERNAME,
            password: process.env.TWITCH_KEY,
        },
        channels: [process.env.USERNAME as string],
    });
    clientTwitch
        .connect()
        .then(() => {
            clientTwitch.say(process.env.USERNAME as string, "pomyślnie połączono z czatem");
            window.webContents.send("timer:console", `pomyślnie połączono z czatem`);
        })
        .catch((err) => {
            console.log(err);
            window.webContents.send("timer:console", `${err}`);
        });
});
ipcMain.on("donate::donate", async (e, donateData) => {
    console.log(`got donate data: `, donateData);

    const url = googleTTS.getAudioUrl(donateData.message, {
        lang: "pl",
        slow: false,
        host: "https://translate.google.com",
    });
    const donationWarningPath = "/home/dave/.omega/sounds/Chaturbate - Tip Sound - Tiny [pQoarCfAi40].mp3";
    const downloadFile = async (url: string, path: string) => {
        const res = await fetch(url);
        const fileStream = fs.createWriteStream(path);
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });
    };

    // fetch(url)
    //     .then((file) => file.buffer)
    //     .then((file: any) => {
    //         console.log(path.join(appPath(), "ivona.mp3"));
    //         fs.writeFile(path.join(appPath(), "ivona.mp3"), Buffer.from(file), (err) => {
    //             if (err) console.log(`\n\n-------`, err);
    //             // mp3Duration(path.join(appPath(), "ivona.mp3"), (err: any, duration: any) => {
    //             //     if (err) console.log(`err: `, err);
    //             //     else console.log(`duration: `, duration);
    //             // });
    //         });
    //     });
    try {
        const ivonaFile = await downloadFile(url, path.join(appPath(), "ivona.mp3"));
        const ivonaDuration = await mp3Duration(path.join(appPath(), "ivona.mp3"));
        const donationWarningDuration = await mp3Duration(donationWarningPath);

        console.log(`ivona duration: `, ivonaDuration);
        console.log(`duration: `, donationWarningDuration);
        playSound(donationWarningPath);

        setTimeout(() => {
            playSound(url);
        }, donationWarningDuration * 1000 + 100);
        wws.emit("donate::donate", donateData);
    } catch (err) {
        console.log(err);
    }

    // mp3Duration(donationWarning, (err: any, duration: any) => {
    //     if (err) {
    //         console.log("error while reading donation warning");
    //         return window.webContents.send("timer:console", `error accoured while reading doantion warning sound`);
    //     }
    //     console.log("duration: ", duration);
    //     playSound(donationWarning);
    //     setTimeout(() => {
    //         playSound(url);
    //     }, duration * 1000 + 100);
    //     console.log("\n\n", url);
    // });
});
ipcMain.on("test", (e, message) => {
    console.log(`BIG TEST: `, message);
});

WebServer.listen("3200", () => {
    console.log("timer is being listen on port 3200");
});
robloxWWW.listen("6969", () => {
    console.log("roblox donations is being listen on port 6969");
});

http.listen(8080, () => console.log("http working on 8080"));
