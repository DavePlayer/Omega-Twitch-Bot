import SocketIO from "socket.io";
const { io } = require("socket.io-client");
import keytar from 'keytar'
import chalk from 'chalk';
import fetch from "node-fetch";
import { window } from "../../main";
import DonationSystem from "./../donationQuerry/donationQuery";

// const wws = new WebSocket.Server({server: require('http').createServer(WebServer)})
export const getToken: (login: string, password: string) => Promise<{ token: string }> =
    async (login: string, password: string) => {
        try {
            if (login == undefined || password == undefined) throw new Error('credentials are undefined')
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
            const json = await fetch(`${process.env.ROBLOX_DONATION_API}/authenticate`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': JSON.stringify({ login, password })
                },
            })
            if (json == undefined || json == null) throw new Error(`json of token is undefined`)
            const token = await json.json()
            if (json.status == 403) throw new Error(`403 error:${JSON.stringify(token.details)}`)
            if (token == undefined || token == null) throw new Error(`token is undefined`)
            return token
        } catch (error) {
            throw new Error(error)
        }
    }
export const initRobloxSockets = async (token: { token: string }, wws: SocketIO.Server, login: string) => {
    console.log(chalk.hex("#393b3d").bgHex("#dee1e3")(`\n connecting to ${process.env.ROBLOX_DONATION_SOCKET}`))
    const socket: SocketIO.Socket = await io(`${process.env.ROBLOX_DONATION_SOCKET}`, {
        transports: ['websocket'],
        rejectUnauthorized: false,
        extraHeaders: {
            Authorization: token.token
        }
    })

    socket.on('connection', (e: any, data: any) => console.log(chalk.white(`connected to roblox donation server`)))
    socket.on("connect_error", (msg: Error) => {
        // revert to classic upgrade
        console.log(chalk.bgRed('\n\nerror when connecting to roblox server'))
        window.webContents.send("timer:console", `error while trying to connect to roblox donation server`);
        if (msg) console.log(chalk.red(JSON.stringify(msg)))
        socket.removeAllListeners()
    });

    socket.on("donation::donation", async (donateData) => {
        console.log(chalk.hex("#393b3d").bgHex("#dee1e3")(`got donation data: `));
        console.log(donateData)
        if (donateData && donateData.toWhom && donateData.toWhom == login)
            DonationSystem.manageDonation(wws, donateData);
    });
    return socket
};

export const getCredentials = () => new Promise<{ account: string, password: string }>((resolve, rej) => {
    const secret = keytar.findCredentials('robloxCredentials')
        .catch(err => rej(err))
    interface ICrenentials {
        account: string, password: string
    }
    secret.then(async (res: {
        account: string;
        password: string;
    }[]) => {
        if (res == null || res.length == 0) return rej('no credentials saved for roblox auth')
        resolve(res[0] || { account: 'invalid', password: 'user' })
    }).catch(err => rej(err))

})