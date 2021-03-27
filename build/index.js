"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __importDefault(require("electron"));
var url_1 = __importDefault(require("url"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var WebServer = express_1.default();
WebServer.get('/', function (req, res) {
    res.sendfile(path_1.default.resolve(__dirname + "/../obs_html/index.html"));
});
var app = electron_1.default.app, BrowserWindow = electron_1.default.BrowserWindow, ipcMain = electron_1.default.ipcMain;
app.on('ready', function () {
    var window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    window.loadURL(url_1.default.format({
        pathname: path_1.default.join(__dirname, '../electron_files/index.html'),
        protocol: 'file',
        slashes: true
    }));
});
ipcMain.on('timer:updateClock', function (e, clock) {
    console.log(clock);
});
WebServer.listen('3200', function () { return console.log('listening on port 3200'); });
