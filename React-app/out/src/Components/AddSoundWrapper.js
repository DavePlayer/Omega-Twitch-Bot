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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSoundWrapper = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var AddSoundWrapper = function () {
    var _a = react_1.useState([]), keys = _a[0], setKeys = _a[1];
    var _b = react_1.useState(""), shortcut = _b[0], setShortcut = _b[1];
    // useEffect(() => {
    //     const listener: EventListener = (e: Event) => {
    //         console.log(e);
    //         if (isFocused) {
    //             console.log(e);
    //         }
    //     };
    //     document.addEventListener("keydown", listener);
    //     return () =>
    //         document.removeEventListener("keydown", listener as EventListener);
    // }, []);
    return (jsx_runtime_1.jsx("div", __assign({ className: "wrapper" }, { children: jsx_runtime_1.jsxs("form", __assign({ action: "#", className: "box" }, { children: [jsx_runtime_1.jsx("h1", { children: "Add sound" }, void 0), jsx_runtime_1.jsx("input", { type: "text", placeholder: "Name" }, void 0), jsx_runtime_1.jsx("input", { type: "search", className: "search", placeholder: "shortcut", onKeyDown: function (e) {
                        console.log(e.key);
                        setKeys(function (prev) {
                            console.log(__spreadArray(__spreadArray([], prev), [e.key]));
                            return __spreadArray(__spreadArray([], prev), [e.key]);
                        });
                        setShortcut(function (prev) {
                            if (prev.length == 0) {
                                return prev + e.key;
                            }
                            return prev + (" + " + e.key);
                        });
                    }, value: shortcut }, void 0)] }), void 0) }), void 0));
};
exports.AddSoundWrapper = AddSoundWrapper;
//# sourceMappingURL=AddSoundWrapper.js.map