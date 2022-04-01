import electron, { globalShortcut, session } from "electron";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { existsSync } from "original-fs";
import getSystemFonts from "get-system-fonts";
import chalk from 'chalk';

// www servers and sounds functions
import { mapSounds, writeSoundJson } from "./srcElectron/routes/sounds";
import { WebServer } from "./srcElectron/www";
const port = "6969";
WebServer.listen(port, () => {
    console.log(`timer is being listen on port ${port}`);
});

// wws socket
import { wws, mapWWS } from "./srcElectron/webSockets/wws";
mapWWS(wws);

// twtich
import { client, mapTwitchClient } from "./srcElectron/twitch";
let clientTwitch = client;
mapTwitchClient(clientTwitch, wws);

// env config
dotenv.config();

// roblox api
import { initRobloxSockets, getToken, getCredentials } from './srcElectron/webSockets/RobloxSocketClient'
getCredentials()
    .then(credentials => {
        getToken(credentials.account, credentials.password)
            .then((token) => {
                initRobloxSockets(token, wws)
            })
            .catch(err => {
                if (err.message.includes('FetchError')) {
                    console.log(chalk.bgRed(err))
                    window.webContents.send("timer:console", err);
                } else {
                    console.log(chalk.yellow(err))
                    window.webContents.send("timer:console", err);
                }
            })
    })
    .catch(err => console.log(chalk.bgRed(err)))


console.log('\n\n\nroblox api')

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
    getSystemFonts()
        .catch(err => console.log(chalk.bgRed(`couldn't get system fonts`)))
});

// IpcMain
import { ipcMain, mapIpc } from "./srcElectron/webSockets/ipcMain";
mapIpc(ipcMain, wws, clientTwitch, app);
