import electron from 'electron'
import url from 'url'
import path from 'path'
const {app, BrowserWindow, ipcMain} = electron

let window:electron.BrowserWindow

app.on('ready', () => {
    window = new BrowserWindow({
            width: 600,
            height: 550,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                //devTools: true
        }
    })
    window.loadURL(url.format({
        pathname: path.join(__dirname, './src/index.html'),
        protocol: 'file',
        slashes: true
    }))
})

require('electron-reload')(__dirname)