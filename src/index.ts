
import electron from 'electron'
import url from 'url'
import path from 'path'
import express from 'express'

const WebServer:express.Application = express()

WebServer.get('/', (req:express.Request, res:express.Response) => {
    res.sendfile(path.resolve(`${__dirname}/../obs_html/index.html`))
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
})


WebServer.listen('3200', () => console.log('listening on port 3200'))
