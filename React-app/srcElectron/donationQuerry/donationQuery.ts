import { appPath, window } from "../../main";
import path from "path";
import fs from "fs";
import mp3Duration from "mp3-duration";
import fetch from "node-fetch";
import * as googleTTS from "google-tts-api";
import { playSound } from "./../routes/sounds";
import SocketIO from "socket.io";

interface ISettings {

}

interface IDonationData {
    donateImageUrl: string;
    userName: string;
    robuxAmmount: number;
    message: string;
    lang: string;
}

class Donations {
    querry: Array<IDonationData>;
    isPlaying: boolean;
    constructor() {
        this.querry = [];
        this.isPlaying = false;
    }

    downloadFile = async (url: string, path: string) => {
        const res = await fetch(url);
        const fileStream: any = fs.createWriteStream(path);
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });
    };

    async manageDonation(wws: SocketIO.Server, DonationData?: IDonationData) {
        if (DonationData) this.querry = [...this.querry, DonationData];
        if (this.isPlaying == false && this.querry.length > 0) {
            this.isPlaying = true;
            const data = this.querry[0];
            try {
                const url = await googleTTS.getAudioUrl(data.message, {
                    lang: data.lang,
                    slow: false,
                    host: "https://translate.google.com",
                });
                const donationWarningPath = "/home/dave/.omega/sounds/Chaturbate - Tip Sound - Tiny [pQoarCfAi40].mp3";
                await this.downloadFile(url, path.join(appPath(), "ivona.mp3"));
                const ivonaDuration = await mp3Duration(path.join(appPath(), "ivona.mp3"));
                const donationWarningDuration = await mp3Duration(donationWarningPath);
                console.log(`ivona duration: `, ivonaDuration);

                console.log(`duration: `, donationWarningDuration);
                const donation = this.querry[0];
                playSound(donationWarningPath);
                console.log(`playing warning`);

                wws.emit("donate::donate", data);
                setTimeout(() => {
                    console.log(`playing ivona`);
                    playSound(url);
                    this.querry.shift();
                    setTimeout(() => {
                        this.isPlaying = false;
                        this.manageDonation(wws);
                    }, ivonaDuration + 5000);
                }, donationWarningDuration * 1000 + 100);
            } catch (err) {
                console.log(err);
            }
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
    }
}

export default new Donations();
