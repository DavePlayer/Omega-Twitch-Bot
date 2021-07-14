"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __importStar(require("electron"));
var url_1 = __importDefault(require("url"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var tmi_js_1 = __importDefault(require("tmi.js"));
var dotenv_1 = __importDefault(require("dotenv"));
var fs_1 = __importDefault(require("fs"));
var original_fs_1 = require("original-fs");
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var stream_1 = require("stream");
dotenv_1.default.config();
var exec = require("child_process").exec;
//require("electron-reload")(process.cwd());
var WebServer = express_1.default();
WebServer.use(cors_1.default());
WebServer.use(express_1.default.json());
WebServer.use(express_fileupload_1.default());
WebServer.get("/", function (req, res) {
    res.sendfile(path_1.default.resolve(__dirname + "/obs_html/index.html"));
});
WebServer.get("/sounds", function (req, res) {
    console.log("some send request for sounds json");
    loadSounds()
        .then(function (sounds) { return res.json(sounds); })
        .catch(function (err) { return res.status(err.status).json(err.error); });
});
WebServer.get("/getImage", function (req, res) {
    console.log(req.query);
    //res.sendFile(req.query.path as string);
    var r = fs_1.default.createReadStream(req.query.path); // or any other way to get a readable stream
    var ps = new stream_1.Stream.PassThrough(); // <---- this makes a trick with stream error handling
    stream_1.Stream.pipeline(r, ps, // <---- this makes a trick with stream error handling
    function (err) {
        if (err) {
            console.log(err); // No such file or any other kind of error
            return res.sendStatus(400);
        }
    });
    ps.pipe(res); // <---- this makes a trick with stream error handling
});
WebServer.post("/sounds", function (req, res) {
    console.log("uploading new sound");
    console.log("body: ", req.body);
    console.log("files: ", req.files);
    // These files don't have proper types, so i had to do that
    var thumbnailFile = req.files.thumbnail;
    var soundFile = req.files.sound;
    thumbnailFile.name = String(thumbnailFile.name)
        .replace(/[^a-zA-Z0-9-. ]/g, "")
        .replace(/\s+/g, "-");
    soundFile.name = String(soundFile.name)
        .replace(/[^a-zA-Z0-9-. ]/g, "")
        .replace(/\s+/g, "-");
    fs_1.default.writeFile(path_1.default.join(appPath(), "thumbnails", thumbnailFile.name), thumbnailFile.data, function (err) {
        if (err)
            throw err;
        else {
            window.webContents.send("timer:console", "created " + thumbnailFile.name + " file");
        }
    });
    fs_1.default.writeFile(path_1.default.join(appPath(), "sounds", soundFile.name), soundFile.data, function (err) {
        if (err)
            throw err;
        else {
            window.webContents.send("timer:console", "created " + soundFile.name + " file");
        }
    });
    var file = fs_1.default.readFileSync(path_1.default.join(appPath(), "sounds.json"), "utf-8");
    var json = JSON.parse(file);
    json = __spreadArray(__spreadArray([], json), [
        {
            name: req.body.name,
            keyBinding: req.body.shortcut,
            soundPath: path_1.default.join(appPath(), "sounds", soundFile.name.replace(/\s+/g, "-").replace(/\s+/g, "-")),
            thumbnailPath: path_1.default.join(appPath(), "thumbnails", thumbnailFile.name.replace(/\s+/g, "-").replace(/\s+/g, "-")),
            volume: 100,
            duration: soundFile.data.duration,
        },
    ]);
    writeSoundJson(json, function () { return mapSounds("reload"); });
    res.json({ status: "OK" });
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
            return process.env.APPDATA + "\\omega";
        }
        case "linux": {
            return process.env.HOME + "/.omega";
        }
    }
};
var writeSoundJson = function (json, callback) {
    fs_1.default.writeFileSync(path_1.default.join(appPath(), "sounds.json"), JSON.stringify(json ? json : []));
    if (callback)
        callback();
};
var loadSounds = function () {
    return new Promise(function (res, rej) {
        if (fs_1.default.existsSync(path_1.default.join(appPath(), "sounds.json"))) {
            var file = fs_1.default.readFileSync(path_1.default.join(appPath(), "sounds.json"), "utf-8");
            var json = JSON.parse(file);
            console.log(json);
            res(json);
        }
        else {
            rej({ status: 404, error: "no sounds found" });
        }
    });
};
var loadedSounds = [];
var isPlaying = false;
var mapSounds = function (action) {
    switch (action) {
        case "reload":
            electron_1.globalShortcut.unregisterAll();
            mapSounds("load");
            break;
        case "load":
        default:
            loadSounds()
                .then(function (sounds) { return (loadedSounds = sounds); })
                .then(function () {
                return loadedSounds.map(function (sound) {
                    electron_1.globalShortcut.register(sound.keyBinding, function () {
                        console.log(sound.keyBinding);
                        if (isPlaying == false) {
                            console.log("mpv " + sound.soundPath + " --volume=" + sound.volume);
                            var cmd = exec("mpv " + sound.soundPath + " --volume=" + sound.volume);
                            cmd.stdout.on("data", function (data) {
                                console.log(data.toString());
                            });
                            // what to do with data coming from the standard error
                            cmd.stderr.on("data", function (data) {
                                console.log(data.toString());
                                window.webContents.send("timer:console", data.toString());
                            });
                            // what to do when the command is done
                            cmd.on("exit", function (code) {
                                console.log("program ended with code: " + code);
                                window.webContents.send("timer:console", "Ended playing sound " + code);
                            });
                        }
                    });
                });
            })
                .catch(function (err) { return console.log(err); });
            break;
    }
};
app.on("ready", function () {
    console.log(appPath());
    //registering shourtcuts even when app is not focused
    electron_1.globalShortcut.register("Control + Alt + v", function () {
        return console.log("ztrl+alt+v");
    });
    window = new BrowserWindow({
        width: 800,
        height: 550,
        frame: false,
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
    if (!original_fs_1.existsSync(appPath())) {
        fs_1.default.mkdir(appPath(), function (err) {
            if (err)
                throw err;
            console.log("created .omega");
            window.webContents.send("timer:console", "created " + appPath());
            fs_1.default.mkdir(path_1.default.join(appPath(), "thumbnails"), function (err) {
                if (err)
                    throw err;
                console.log("created thumbnails folder");
                window.webContents.send("timer:console", "created " + path_1.default.join(appPath(), "thumbnails"));
            });
            fs_1.default.mkdir(path_1.default.join(appPath(), "sounds"), function (err) {
                if (err)
                    throw err;
                console.log("created sounds folder");
                window.webContents.send("timer:console", "created " + path_1.default.join(appPath(), "sounds.json"));
            });
        });
        writeSoundJson();
    }
    else {
        console.log(".omega already exist");
        window.webContents.send("timer:console", "omega already exist");
        mapSounds();
    }
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