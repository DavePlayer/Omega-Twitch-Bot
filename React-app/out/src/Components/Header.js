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
exports.Header = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var electron_1 = require("electron");
var Header = function () {
    return (jsx_runtime_1.jsxs("header", { children: [jsx_runtime_1.jsx("section", __assign({ className: "name" }, { children: "Omega Timer" }), void 0), jsx_runtime_1.jsxs("section", __assign({ className: "exit" }, { children: [jsx_runtime_1.jsx("span", { children: jsx_runtime_1.jsx("svg", __assign({ width: "25%", height: "100%", version: "1.1", viewBox: "0 0 20 20", x: "0px", y: "0px", className: "svg" }, { children: jsx_runtime_1.jsxs("g", { children: [jsx_runtime_1.jsx("path", { d: "M10 8a2 2 0 100 4 2 2 0 000-4z" }, void 0), jsx_runtime_1.jsx("path", { fillRule: "evenodd", d: "M9 2h2a2.01 2.01 0 001.235 1.855l.53.22a2.01 2.01 0 002.185-.439l1.414 1.414a2.01 2.01 0 00-.439 2.185l.22.53A2.01 2.01 0 0018 9v2a2.01 2.01 0 00-1.855 1.235l-.22.53a2.01 2.01 0 00.44 2.185l-1.415 1.414a2.01 2.01 0 00-2.184-.439l-.531.22A2.01 2.01 0 0011 18H9a2.01 2.01 0 00-1.235-1.854l-.53-.22a2.009 2.009 0 00-2.185.438L3.636 14.95a2.009 2.009 0 00.438-2.184l-.22-.531A2.01 2.01 0 002 11V9c.809 0 1.545-.487 1.854-1.235l.22-.53a2.009 2.009 0 00-.438-2.185L5.05 3.636a2.01 2.01 0 002.185.438l.53-.22A2.01 2.01 0 009 2zm-4 8l1.464 3.536L10 15l3.535-1.464L15 10l-1.465-3.536L10 5 6.464 6.464 5 10z", clipRule: "evenodd" }, void 0)] }, void 0) }), void 0) }, void 0), jsx_runtime_1.jsx("span", { children: jsx_runtime_1.jsx("svg", __assign({ width: "25%", onClick: function () { return electron_1.ipcRenderer.send("app:close"); }, height: "100%", version: "1.1", viewBox: "0 0 20 20", x: "0px", y: "0px", className: "svg", id: "close" }, { children: jsx_runtime_1.jsx("g", { children: jsx_runtime_1.jsx("path", { d: "M8.5 10L4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z" }, void 0) }, void 0) }), void 0) }, void 0)] }), void 0)] }, void 0));
};
exports.Header = Header;
//# sourceMappingURL=Header.js.map