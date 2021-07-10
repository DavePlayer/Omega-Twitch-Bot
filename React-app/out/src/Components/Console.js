"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Console = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var App_1 = require("../App");
var electron_1 = require("electron");
var Console = function () {
    var Console = react_1.useContext(App_1.consoleContext);
    react_1.useEffect(function () {
        if (Console.listens == false) {
            electron_1.ipcRenderer.on("timer:console", function (e, message) {
                Console.log(message);
            });
            Console.setListens(true);
        }
    }, []);
    return (jsx_runtime_1.jsx("textarea", { value: Console.content, id: "console", readOnly: true }, void 0));
};
exports.Console = Console;
//# sourceMappingURL=Console.js.map