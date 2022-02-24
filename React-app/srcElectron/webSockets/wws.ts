import SocketIO from "socket.io";

const http = require("http").createServer();
export const wws: SocketIO.Server = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});
//const wws = new WebSocket.Server({server: require('http').createServer(WebServer)})

export const mapWWS = (wws: SocketIO.Server) => {
    wws.on("connection", (socket: SocketIO.Socket) => {
        console.log("new client connected");
        socket.send("connection confirmed");

        socket.on("timer:update", () => {
            console.log("updated clock");
        });
        socket.on("timer:console", (message) => {
            console.log(message);
        });
        socket.on("timer:cheer", (cheer) => {
            console.log("cheer granted", cheer);
        });
    });
    http.listen(8080, () => console.log("http working on 8080"));
};
