import electron, { globalShortcut } from "electron";
import url from "url";
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
dotenv.config();
//require("electron-reload")(process.cwd());

const WebServer: express.Application = express();
WebServer.use(cors());
WebServer.use(express.json());
WebServer.use(upload());

WebServer.get("/", (req: express.Request, res: express.Response) => {
    res.sendfile(path.resolve(`${__dirname}/obs_html/index.html`));
});

WebServer.get("/sounds", (req: express.Request, res: express.Response) => {
    console.log("some send request for sounds json");
    if (fs.existsSync(path.join(appPath(), "sounds.json"))) {
        const file = fs.readFileSync(
            path.join(appPath(), "sounds.json"),
            "utf-8"
        );
        const json = JSON.parse(file);
        console.log(json);
        res.json(json);
    } else {
        res.status(404).json({ error: "no sounds found" });
    }
});

WebServer.post("/sounds", (req: express.Request, res: express.Response) => {
    console.log("uploading new sound");
    console.log("body: ", req.body);
    console.log(`files: `, req.files);
    console.log("-------------------------");
});

const http = require("http").createServer();
const wws: SocketIO.Server = require("socket.io")(http, {
    cors: { origin: "*" },
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
    options: { debug: true },
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
        window.webContents.send(
            "timer:console",
            `pomyślnie połączono z czatem`
        );
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
    clientTwitch.say(
        process.env.USERNAME as string,
        "pomyślnie połączono z czatem"
    );
    //window.webContents.send('timer:console', `pomyślnie połączono z czatem`)
});

clientTwitch.on(
    "cheer",
    (channel: any, userstate: tmi.Userstate, message: any) => {
        // Do your stuff.
        console.log(userstate.bits, "-------------");
        //clientTwitch.say(process.env.USERNAME as string, `Ktoś dał donate ${userstate.bits}, więc daj znać dave, że twitch dobrze podaje cheersy`)
        wws.emit("timer:cheer", userstate.bits);
        window.webContents.send(
            "timer:console",
            `someone cheered ${userstate.bits} bits`
        );
    }
);

const { app, BrowserWindow, ipcMain } = electron;

// process.env.NODE_ENV = 'production'

let window: electron.BrowserWindow;

const appPath = () => {
    switch (process.platform) {
        case "darwin": {
            return path.join(
                process.env.HOME,
                "Library",
                "Application Support",
                "omega"
            );
        }
        case "win32": {
            return process.env.APPDATA + "\\omega";
        }
        case "linux": {
            return process.env.HOME + "/.omega";
        }
    }
};

const writeSoundJson = (json?: Array<sound>) => {
    if (!json) {
        fs.writeFileSync(
            path.join(appPath(), "sounds.json"),
            JSON.stringify([])
        );
    } else {
        fs.writeFileSync(
            path.join(appPath(), "sounds.json"),
            JSON.stringify(json)
        );
    }
};

app.on("ready", () => {
    console.log(appPath());
    if (!existsSync(appPath())) {
        fs.mkdir(appPath(), (err) => {
            if (err) throw err;
            console.log("created .omega");
        });
        fs.mkdir(path.join(appPath(), "thumbnails"), (err) => {
            if (err) throw err;
            console.log("created thumbnails");
        });
        writeSoundJson();
    } else {
        console.log(".omega already exist");
    }
    //registering shourtcuts even when app is not focused
    globalShortcut.register("Control + Alt + v", () =>
        console.log("ztrl+alt+v")
    );
    window = new BrowserWindow({
        width: 600,
        height: 550,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        },
    });
    window.loadURL(
        url.format({
            pathname: path.join(__dirname, "src/index.html"),
            protocol: "file",
            slashes: true,
        })
    );
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
        options: { debug: true },
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
            clientTwitch.say(
                process.env.USERNAME as string,
                "pomyślnie połączono z czatem"
            );
            window.webContents.send(
                "timer:console",
                `pomyślnie połączono z czatem`
            );
        })
        .catch((err) => {
            console.log(err);
            window.webContents.send("timer:console", `${err}`);
        });
});

WebServer.listen("3200", () => console.log("listening on port 3200"));
http.listen(8080, () => console.log("http working on 8080"));
