
import electron from 'electron'
import url from 'url'
import path from 'path'
import express from 'express'
import SocketIO from 'socket.io'
const cors = require('cors')

const WebServer:express.Application = express()
WebServer.use(cors())

WebServer.get('/', (req:express.Request, res:express.Response) => {
    res.sendfile(path.resolve(`${__dirname}/../obs_html/index.html`))
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
})

const {app, BrowserWindow, ipcMain} = electron

app.on('ready', () => {
    const window:electron.BrowserWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
        }
    })

    window.loadURL(url.format({
        pathname: path.join(__dirname, '../electron_files/index.html'),
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

WebServer.listen('3200', () => console.log('listening on port 3200'))
http.listen(8080, () => console.log('http working on 8080'))
