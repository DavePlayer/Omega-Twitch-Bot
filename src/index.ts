
import electron from 'electron'
import url from 'url'
import path from 'path'

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
