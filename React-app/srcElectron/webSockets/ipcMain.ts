import electron from "electron";
import SocketIO from "socket.io";
import tmi from "tmi.js";
import { window } from "../../main";
import DonationSystem from "./../donationQuerry/donationQuery";
import getSystemFonts from "get-system-fonts";
import GlobalSettings from './../globalSettings'
import keytar from 'keytar'
import { getToken, initRobloxSockets } from "./RobloxSocketClient";
import chalk from 'chalk';

export const { ipcMain } = electron;

export const mapIpc = (
    ipcMain: electron.IpcMain,
    wws: SocketIO.Server,
    clientTwitch: tmi.Client,
    app: electron.App
) => {
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
                console.log(chalk.bgHex("#6441A4")(`properly connected to twitch server`));
            })
            .catch((err) => {
                console.log(chalk.black.bgRed(`error when sending message on twitch chat: `, err))
                window.webContents.send("timer:console", `${err}`);
            });
    });
    ipcMain.on('fonts:getFonts', async () => {
        getSystemFonts()
            .then(fonts => window.webContents.send('fonts:sendFonts', fonts))
    })
    ipcMain.on("donate::donate", async (e, donateData) => {
        // console.log(`got donate data: `, donateData);
        DonationSystem.manageDonation(wws, donateData);
    });
    ipcMain.on("donate::appendSettings", async (e, settings, type) => {
        // console.log(`got donate data: `, donateData);
        console.log(`donation settings appending: `, type, settings)
        switch (type) {
            case `robloxColors`:
                GlobalSettings.overwriteRobloxColors(settings)
                break;
            case `robloxFont`:
                GlobalSettings.overwriteRobloxFont(settings)
                break;
            default:
                break;
        }
        wws.emit("donate::appendSettings", GlobalSettings.Roblox);
    });
    ipcMain.on("donate::changeLoginData", async (e, loginData: { username: string, password: string }) => {
        console.log(`changing login data`)
        await keytar.findCredentials(`robloxCredentials`)
            .then(accounts => {
                accounts.map(account => {
                    keytar.deletePassword(`robloxCredentials`, account.account)
                        .then(() => {
                            console.log(`removed account: `, account)
                        })
                        .catch(err => console.log(err))
                })
            })
            .finally(() => {
                keytar.setPassword('robloxCredentials', loginData.username, loginData.password)
                    .then(() => {
                        console.log(`properly saved user data: ${loginData.username} ${loginData.password}`)
                        getToken(loginData.username, loginData.password)
                            .then((token) => {
                                initRobloxSockets(token, wws, loginData.username)
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
                    .catch(err => console.log(err))
            })
    })
    ipcMain.on("test", (e, message) => {
        console.log(`BIG TEST: `, message);
    });
};
