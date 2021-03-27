
import electron from 'electron'
import url from 'url'
import path from 'path'

const {app, BrowserWindow} = electron

app.on('ready', () => {
    const window:electron.BrowserWindow = new BrowserWindow({})

    window.loadURL(url.format({
        pathname: path.join(__dirname, '../electron_files/index.html'),
        protocol: 'file',
        slashes: true
    }))
})
    console.log(path.join(__dirname, '/electron_files/index.html'))
