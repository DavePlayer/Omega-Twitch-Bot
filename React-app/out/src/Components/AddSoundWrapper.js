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
var AddSoundWrapper = function (_a) {
    var setShowWrapper = _a.setShowWrapper, fetchData = _a.fetchData;
    var _b = react_1.useState([]), keys = _b[0], setKeys = _b[1];
    var _c = react_1.useState(""), shortcut = _c[0], setShortcut = _c[1];
    var _d = react_1.useState([]), files = _d[0], setFiles = _d[1];
    var _e = react_1.useState(""), name = _e[0], setName = _e[1];
    var _f = react_1.useState("Keys as [] ; ' , . / \\ may cause bugs of key combinations"), error = _f[0], setError = _f[1];
    react_1.useEffect(function () {
        //     const listener: EventListener = (e: Event) => {
        //         console.log(e);
        //         if (isFocused) {
        //             console.log(e);
        //         }
        //     };
        //     document.addEventListener("keydown", listener);
        //     return () =>
        //         document.removeEventListener("keydown", listener as EventListener);
        document
            .querySelector('input[type="search"]')
            .addEventListener("search", function () { return setShortcut(""); });
        return function () {
            return document.removeEventListener("search", function () { return setShortcut(""); });
        };
    }, []);
    var handleSubmit = function (e) {
        console.log(files[0][0]);
        console.log(files[0][0].name);
        e.preventDefault();
        if (name.length == 0 || shortcut.length == 0) {
            return setError("Some input is empty");
        }
        if ((files[0][0].name.includes("png") ||
            files[0][0].name.includes("jpg") ||
            files[0][0].name.includes("jpeg")) &&
            (files[1][0].name.includes("mp3") ||
                files[1][0].name.includes("wav"))) {
            console.log(files);
            console.log(shortcut);
            console.log(name);
            var rawData = new FormData();
            rawData.append("thumbnail", files[0][0]);
            rawData.append("sound", files[1][0]);
            rawData.append("shortcut", shortcut);
            rawData.append("name", name);
            fetch("http://127.0.0.1:3200/sounds", {
                method: "POST",
                body: rawData,
            })
                .then(function (data) {
                console.log(data);
                console.log("CLOSe eeeshjkaf ");
                setShowWrapper(false);
                //fetchData();
            })
                .catch(function (err) { return console.log(err); });
        }
        else {
            return setError("You messed up Files");
        }
    };
    return (jsx_runtime_1.jsx("div", __assign({ className: "wrapper" }, { children: jsx_runtime_1.jsxs("form", __assign({ action: "#", onSubmit: function (e) { return handleSubmit(e); }, className: "box" }, { children: [jsx_runtime_1.jsx("h1", { children: "Add sound" }, void 0), jsx_runtime_1.jsx("input", { value: name, onChange: function (e) { return setName(e.target.value); }, type: "text", placeholder: "Name" }, void 0), jsx_runtime_1.jsx("input", { type: "search", className: "search", placeholder: "shortcut", onKeyDown: function (e) {
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
                    }, onChange: function () { return null; }, value: shortcut }, void 0), jsx_runtime_1.jsx("input", { type: "file", onChange: function (e) {
                        files.length <= 1
                            ? setFiles(function (prev) { return __spreadArray(__spreadArray([], prev), [e.target.files]); })
                            : setFiles(function (prev) {
                                return prev.map(function (file, i) {
                                    return (i == 0 ? e.target.files : file) || e;
                                });
                            });
                    } }, void 0), jsx_runtime_1.jsx("input", { type: "file", className: "mp3", onChange: function (e) {
                        files.length <= 1
                            ? setFiles(function (prev) { return __spreadArray(__spreadArray([], prev), [e.target.files]); })
                            : setFiles(function (prev) {
                                return prev.map(function (file, i) {
                                    return (i == 1 ? e.target.files : file) || e;
                                });
                            });
                    } }, void 0), jsx_runtime_1.jsx("p", { children: error }, void 0), jsx_runtime_1.jsx("button", __assign({ type: "submit" }, { children: "Upload Sound" }), void 0), jsx_runtime_1.jsx("button", __assign({ onClick: function () { return setShowWrapper(false); } }, { children: "Cancel" }), void 0)] }), void 0) }), void 0));
};
exports.AddSoundWrapper = AddSoundWrapper;
//# sourceMappingURL=AddSoundWrapper.js.map