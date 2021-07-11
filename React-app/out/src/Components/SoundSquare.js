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
exports.SoundSquare = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var SoundSquare = function (_a) {
    var sound = _a.sound;
    var _b = react_1.useState("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.webcraft.com.mt%2Fassets%2Fimg%2FNo-Image-Thumbnail.png&f=1&nofb=1"), image = _b[0], setImage = _b[1];
    return (jsx_runtime_1.jsxs("article", __assign({ className: "sound" }, { children: [jsx_runtime_1.jsx("figure", { children: jsx_runtime_1.jsx("img", { src: "http://127.0.0.1:3200/getImage/?path=" + sound.thumbnailPath }, void 0) }, void 0), jsx_runtime_1.jsx("h4", { children: sound.name }, void 0), jsx_runtime_1.jsx("p", { children: sound.keyBinding }, void 0)] }), void 0));
};
exports.SoundSquare = SoundSquare;
//# sourceMappingURL=SoundSquare.js.map