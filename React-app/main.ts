import electron, { globalShortcut, session } from "electron";
import path from "path";
import SocketIO from "socket.io";
import dotenv from "dotenv";
import fs from "fs";
import { existsSync } from "original-fs";
import * as googleTTS from "google-tts-api";
import fetch from "node-fetch";
import mp3Duration from "mp3-duration";
import tmi from "tmi.js";

// www servers and sounds functions
import { playSound, mapSounds, writeSoundJson } from "./srcElectron/routes/sounds";
import { WebServer } from "./srcElectron/www";
import { robloxWWW } from "./srcElectron/roblox";

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

// twtich
import { client, mapTwitchClient } from "./srcElectron/twitch";
let clientTwitch = client;
mapTwitchClient(clientTwitch, wws);

dotenv.config();

const { app, BrowserWindow, ipcMain } = electron;

// process.env.NODE_ENV = 'production'

export const appPath = () => {
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

export let window: electron.BrowserWindow;

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
