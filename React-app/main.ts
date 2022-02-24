import electron, { globalShortcut, session } from "electron";
import path from "path";
import SocketIO from "socket.io";
import dotenv from "dotenv";
import fs from "fs";
import { existsSync } from "original-fs";

// www servers and sounds functions
import { mapSounds, writeSoundJson } from "./srcElectron/routes/sounds";
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

const { app, BrowserWindow } = electron;

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

// IpcMain
import { ipcMain, mapIpc } from "./srcElectron/webSockets/ipcMain";
mapIpc(ipcMain, wws, clientTwitch, app);

WebServer.listen("3200", () => {
    console.log("timer is being listen on port 3200");
});
robloxWWW.listen("6969", () => {
    console.log("roblox donations is being listen on port 6969");
});

http.listen(8080, () => console.log("http working on 8080"));
