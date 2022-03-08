import SocketIO from "socket.io";
const { io } = require("socket.io-client");

//const wws = new WebSocket.Server({server: require('http').createServer(WebServer)})
export const getToken = async (login: string, password: string) => {
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
        const token = await json.json()
        return token
    } catch (error) {
        console.log(error)
    }
}
export const initRobloxSockets = async (token: { token: string }) => {
    console.log("token: ", token)
    const socket = await io(`${process.env.ROBLOX_DONATION_SOSCKET}`, {
        transports: ['websocket'],
        rejectUnauthorized: false,
        extraHeaders: {
            Authorization: token.token
        }
    })

    socket.on('connection', (e: any, data: any) => console.log('data'))
    socket.on("connect_error", (msg: Error) => {
        // revert to classic upgrade
        if (msg) console.log(msg)
        console.log('\n\nerror when connecting')
    });
};