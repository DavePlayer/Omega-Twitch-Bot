"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __importDefault(require("electron"));
var url_1 = __importDefault(require("url"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var tmi_js_1 = __importDefault(require("tmi.js"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var WebServer = express_1.default();
WebServer.use(cors_1.default());
WebServer.get('/', function (req, res) {
    res.sendfile(path_1.default.resolve(__dirname + "/../obs_html/index.html"));
});
var http = require('http').createServer();
var wws = require('socket.io')(http, {
    cors: { origin: "*" }
});
//const wws = new WebSocket.Server({server: require('http').createServer(WebServer)})
wws.on('connection', function (socket) {
    console.log('new client connected');
    socket.send('connection confirmed');
    socket.on('timer:update', function () {
        console.log('updated clock');
    });
});
var clientTwitch = new tmi_js_1.default.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: process.env.USERNAME,
        password: process.env.TWITCH_KEY
    },
    channels: [process.env.USERNAME]
});
clientTwitch.connect();
// testing by chat because can't test cheers
clientTwitch.on("message", function (channel, userstate, message, self) {
    var bits = parseInt(message);
    if (isNaN(bits) != true) {
        wws.emit('timer:cheer', bits);
    }
});
clientTwitch.on("cheer", function (channel, userstate, message) {
    // Do your stuff.
    console.log(userstate.bits);
    wws.emit('timer:cheer', userstate.bits);
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
    wws.emit('timer:update', clock);
});
ipcMain.on('timer:updateFont', function (e, font) {
    console.log(font);
    wws.emit('timer:font', font);
});
WebServer.listen('3200', function () { return console.log('listening on port 3200'); });
http.listen(8080, function () { return console.log('http working on 8080'); });
