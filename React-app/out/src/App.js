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
exports.App = exports.consoleContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Header_1 = require("./Components/Header");
var Inputs_1 = require("./Components/Inputs");
var TimerConfig_1 = require("./Components/TimerConfig");
var Console_1 = require("./Components/Console");
var react_router_dom_1 = require("react-router-dom");
var Navigation_1 = require("./Components/Navigation");
require("./index.scss");
var Shortcuts_1 = require("./Components/Shortcuts");
exports.consoleContext = react_1.createContext(null);
var App = function () {
    var _a = react_1.useState("Debugging program:"), content = _a[0], setContent = _a[1];
    var _b = react_1.useState(false), listens = _b[0], setListens = _b[1];
    var log = function (value) {
        return setContent(function (prev) { return prev + ("\n:-- " + value); });
    };
    return (jsx_runtime_1.jsx(react_router_dom_1.BrowserRouter, { children: jsx_runtime_1.jsxs(exports.consoleContext.Provider, __assign({ value: { content: content, setContent: setContent, log: log, listens: listens, setListens: setListens } }, { children: [jsx_runtime_1.jsx(Header_1.Header, {}, void 0), jsx_runtime_1.jsx(Navigation_1.Navigation, {}, void 0), jsx_runtime_1.jsx(react_router_dom_1.Redirect, { to: "/" }, void 0), jsx_runtime_1.jsx(react_router_dom_1.Route, { path: "/", exact: true, render: function () { return (jsx_runtime_1.jsxs("main", __assign({ className: "timer" }, { children: [jsx_runtime_1.jsx(Inputs_1.Inputs, {}, void 0), jsx_runtime_1.jsx(TimerConfig_1.TimerConfig, {}, void 0)] }), void 0)); } }, void 0), jsx_runtime_1.jsx(react_router_dom_1.Route, { path: "/shortcuts", exact: true, render: function () { return jsx_runtime_1.jsx(Shortcuts_1.Shortcuts, {}, void 0); } }, void 0), jsx_runtime_1.jsx(Console_1.Console, {}, void 0)] }), void 0) }, void 0));
};
exports.App = App;
//# sourceMappingURL=App.js.map