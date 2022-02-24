import tmi from "tmi.js";
import { window } from "../main";
import SocketIO from "socket.io";

export let client: tmi.Client = new tmi.Client({
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

client
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

export const mapTwitchClient = async (clientTwitch: tmi.Client, wws: SocketIO.Server) => {
    clientTwitch.on("connected", () => {
        console.log("connected properly");
        try {
            clientTwitch.say(process.env.USERNAME as string, "pomyślnie połączono z czatem");
        } catch (err) {
            window.webContents.send("timer:console", `cannot send data to chat: ${err}`);
        }
        //window.webContents.send('timer:console', `pomyślnie połączono z czatem`)
    });

    clientTwitch.on("cheer", (channel: any, userstate: tmi.Userstate, message: any) => {
        // Do your stuff.
        console.log(userstate.bits, "-------------");
        //clientTwitch.say(process.env.USERNAME as string, `Ktoś dał donate ${userstate.bits}, więc daj znać dave, że twitch dobrze podaje cheersy`)
        try {
            wws.emit("timer:cheer", userstate.bits);
            window.webContents.send("timer:console", `someone cheered ${userstate.bits} bits`);
        } catch (err) {
            window.webContents.send("timer:console", `cannot send data to chat: ${err}`);
        }
    });
};
