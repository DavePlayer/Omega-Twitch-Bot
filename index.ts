
import electron from 'electron'
import url from 'url'
import path from 'path'
import express from 'express'
import SocketIO from 'socket.io'
import cors from 'cors'
import tmi from 'tmi.js'
import dotenv from 'dotenv'
dotenv.config()

const WebServer:express.Application = express()
WebServer.use(cors())

WebServer.get('/', (req:express.Request, res:express.Response) => {
    res.sendfile(path.resolve(`${__dirname}/obs_html/index.html`))
})

const http = require('http').createServer()
const wws:SocketIO.Server = require('socket.io')(http, {
    cors: {origin: "*"}
});
//const wws = new WebSocket.Server({server: require('http').createServer(WebServer)})

wws.on('connection', (socket:SocketIO.Socket) => {
    console.log('new client connected')
    socket.send('connection confirmed')

    socket.on('timer:update', () => {
        console.log('updated clock')
    })
    socket.on('timer:cheer', (cheer) => {
        console.log('cheer granted', cheer)
    })
})

let clientTwitch:tmi.Client = new tmi.Client({
 options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
    //server: 'irc.fdgt.dev',
  },
  identity: {
    username: process.env.USERNAME,
    password: process.env.TWITCH_KEY
  },
  channels: [process.env.USERNAME as string]   
})

clientTwitch.connect()
    .then( () => {
        console.log('connected')
    })
    .catch( err => console.log(err))


// testing by chat because can't test cheers
/*clientTwitch.on("message", (channel:any, userstate:any, message:any, self:any) => {
    const bits = parseInt(message)

    if(isNaN(bits) != true) {
        wws.emit('timer:cheer', bits)
    }
})*/
clientTwitch.on("connected", () => {
    console.log('connected properly')
        clientTwitch.say(process.env.USERNAME as string, 'pomyślnie połączono z czatem')
});

clientTwitch.on("cheer", (channel:any, userstate:tmi.Userstate, message:any) => {
    // Do your stuff.
    console.log(userstate.bits, '-----------')
    wws.emit('timer:cheer', userstate.bits)
});

const {app, BrowserWindow, ipcMain} = electron

// process.env.NODE_ENV = 'production'

app.on('ready', () => {
    const window:electron.BrowserWindow = new BrowserWindow({
            width: 600,
            height: 450,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
        }
    })

    window.loadURL(url.format({
        pathname: path.join(__dirname, '/electron_files/index.html'),
        protocol: 'file',
        slashes: true
    }))
})

ipcMain.on('timer:updateClock', (e, clock) => {
    console.log(clock)
    wws.emit('timer:update', clock)
})
ipcMain.on('timer:updateFont', (e, font) => {
    console.log(font)
    wws.emit('timer:font', font)
})
ipcMain.on('app:close', () => {
    app.quit()
})
ipcMain.on('app:updateConfig', (e, token, username) => {
    process.env.TWITCH_KEY = token
    process.env.USERNAME = username
    console.log(token, username)
    clientTwitch = new tmi.Client({
     options: { debug: true },
      connection: {
        secure: true,
        reconnect: true
      },
      identity: {
        username: process.env.USERNAME,
        password: process.env.TWITCH_KEY
      },
      channels: [process.env.USERNAME as string]   
    })
    clientTwitch.connect().then( () => {
        clientTwitch.say(process.env.USERNAME as string, 'pomyślnie połączono z czatem')
    } )
})

WebServer.listen('3200', () => console.log('listening on port 3200'))
http.listen(8080, () => console.log('http working on 8080'))
