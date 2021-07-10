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
var fs_1 = __importDefault(require("fs"));
var original_fs_1 = require("original-fs");
dotenv_1.default.config();
//require("electron-reload")(process.cwd());
var WebServer = express_1.default();
WebServer.use(cors_1.default());
WebServer.use(express_1.default.json());
WebServer.get("/", function (req, res) {
    res.sendfile(path_1.default.resolve(__dirname + "/obs_html/index.html"));
});
WebServer.get("/sounds", function (req, res) {
    console.log("some send request for sounds json");
    var file = fs_1.default.readFileSync(appPath() + "/sounds.json", "utf-8");
    var json = JSON.parse(file);
    console.log(json);
    res.json(json);
});
var http = require("http").createServer();
var wws = require("socket.io")(http, {
    cors: { origin: "*" },
});
//const wws = new WebSocket.Server({server: require('http').createServer(WebServer)})
wws.on("connection", function (socket) {
    console.log("new client connected");
    socket.send("connection confirmed");
    socket.on("timer:update", function () {
        console.log("updated clock");
    });
    socket.on("timer:console", function (message) {
        console.log(message);
    });
    socket.on("timer:cheer", function (cheer) {
        console.log("cheer granted", cheer);
    });
});
var clientTwitch = new tmi_js_1.default.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true,
        //server: 'irc.fdgt.dev',
    },
    identity: {
        username: process.env.USERNAME,
        password: process.env.TWITCH_KEY,
    },
    channels: [process.env.USERNAME],
});
clientTwitch
    .connect()
    .then(function () {
    console.log("connected");
    window.webContents.send("timer:console", "pomy\u015Blnie po\u0142\u0105czono z czatem");
    //setTimeout(() => {
    //    clientTwitch.say(process.env.USERNAME as string, 'bits --bitscount 500 Woohoo!')
    //}, 10000)
})
    .catch(function (err) {
    console.log(err);
    window.webContents.send("timer:console", "" + err);
});
// testing by chat because can't test cheers
/*clientTwitch.on("message", (channel:any, userstate:any, message:any, self:any) => {
    const bits = parseInt(message)

    if(isNaN(bits) != true) {
        wws.emit('timer:cheer', bits)
    }
})*/
clientTwitch.on("connected", function () {
    console.log("connected properly");
    clientTwitch.say(process.env.USERNAME, "pomyślnie połączono z czatem");
    //window.webContents.send('timer:console', `pomyślnie połączono z czatem`)
});
clientTwitch.on("cheer", function (channel, userstate, message) {
    // Do your stuff.
    console.log(userstate.bits, "-------------");
    //clientTwitch.say(process.env.USERNAME as string, `Ktoś dał donate ${userstate.bits}, więc daj znać dave, że twitch dobrze podaje cheersy`)
    wws.emit("timer:cheer", userstate.bits);
    window.webContents.send("timer:console", "someone cheered " + userstate.bits + " bits");
});
var app = electron_1.default.app, BrowserWindow = electron_1.default.BrowserWindow, ipcMain = electron_1.default.ipcMain;
// process.env.NODE_ENV = 'production'
var window;
var appPath = function () {
    switch (process.platform) {
        case "darwin": {
            return path_1.default.join(process.env.HOME, "Library", "Application Support", "omega");
        }
        case "win32": {
            return process.env.APPDATA + "omega";
        }
        case "linux": {
            return process.env.HOME + "/.omega";
        }
    }
};
app.on("ready", function () {
    console.log(appPath());
    if (!original_fs_1.existsSync(appPath())) {
        fs_1.default.mkdir(appPath(), function (err) {
            if (err)
                throw err;
            console.log("created .omega");
        });
    }
    else {
        console.log(".omega already exist");
    }
    window = new BrowserWindow({
        width: 600,
        height: 550,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        },
    });
    window.loadURL(url_1.default.format({
        pathname: path_1.default.join(__dirname, "src/index.html"),
        protocol: "file",
        slashes: true,
    }));
});
ipcMain.on("timer:updateClock", function (e, clock) {
    console.log(clock);
    wws.emit("timer:update", clock);
    window.webContents.send("timer:console", "Timer updated");
});
ipcMain.on("timer:updateFont", function (e, font) {
    console.log(font);
    wws.emit("timer:font", font.fontSize);
    window.webContents.send("timer:console", "Font Changed");
});
ipcMain.on("app:close", function () {
    app.quit();
});
ipcMain.on("app:updateConfig", function (e, token, username) {
    process.env.TWITCH_KEY = token;
    process.env.USERNAME = username;
    console.log(token, username);
    clientTwitch = new tmi_js_1.default.Client({
        options: { debug: true },
        connection: {
            secure: true,
            reconnect: true,
        },
        identity: {
            username: process.env.USERNAME,
            password: process.env.TWITCH_KEY,
        },
        channels: [process.env.USERNAME],
    });
    clientTwitch
        .connect()
        .then(function () {
        clientTwitch.say(process.env.USERNAME, "pomyślnie połączono z czatem");
        window.webContents.send("timer:console", "pomy\u015Blnie po\u0142\u0105czono z czatem");
    })
        .catch(function (err) {
        console.log(err);
        window.webContents.send("timer:console", "" + err);
    });
});
WebServer.listen("3200", function () { return console.log("listening on port 3200"); });
http.listen(8080, function () { return console.log("http working on 8080"); });
//# sourceMappingURL=main.js.map