import electron from "electron";
import SocketIO from "socket.io";
import * as googleTTS from "google-tts-api";
import fetch from "node-fetch";
import mp3Duration from "mp3-duration";
import tmi from "tmi.js";
import { playSound } from "./../routes/sounds";
import fs from "fs";
import path from "path";
import { appPath, window } from "../../main";

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
            const fileStream: any = fs.createWriteStream(path);
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
};
