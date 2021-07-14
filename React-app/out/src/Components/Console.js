"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Console = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var App_1 = require("../App");
var electron_1 = require("electron");
var Console = function () {
    var Console = react_1.useContext(App_1.consoleContext);
    var AreaRef = react_1.useRef(null);
    react_1.useEffect(function () {
        if (Console.listens == false) {
            electron_1.ipcRenderer.on("timer:console", function (e, message) {
                Console.log(message);
            });
            Console.setListens(true);
        }
    }, []);
    react_1.useEffect(function () {
        AreaRef.current.scrollTop = AreaRef.current.scrollHeight;
    }, [Console.content]);
    return (jsx_runtime_1.jsx("section", __assign({ className: "consoleWrapper" }, { children: jsx_runtime_1.jsx("textarea", { ref: AreaRef, value: Console.content, id: "console", readOnly: true }, void 0) }), void 0));
};
exports.Console = Console;
//# sourceMappingURL=Console.js.map