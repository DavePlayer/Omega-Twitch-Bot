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
exports.TimerConfig = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_final_form_1 = require("react-final-form");
var App_1 = require("../App");
var electron_1 = require("electron");
var handleSubmit = function (e, Console, setDisplayConfig) {
    console.log(e);
    Console.log("Updating Config: " + JSON.stringify(e));
    electron_1.ipcRenderer.send("app:updateConfig", e.token, e.username);
    setDisplayConfig(false);
};
var Input = function (props) {
    return (jsx_runtime_1.jsxs("section", __assign({ className: "input-and-error" }, { children: [jsx_runtime_1.jsx("p", __assign({ className: "error" }, { children: props.meta.touched && props.meta.error }), void 0), jsx_runtime_1.jsx("input", __assign({}, props.input, props.inputProps, { type: props.input.type, className: props.className, id: props.input.id, placeholder: props.placeholder }), void 0)] }), void 0));
};
var checkLength = function (value) {
    if (!value || value.length == 0) {
        return "wypełnij coś debilu";
    }
    return undefined;
};
var TimerConfig = function () {
    var _a = react_1.useState(false), displayConfig = _a[0], setDisplayConfig = _a[1];
    var Console = react_1.useContext(App_1.consoleContext);
    return (jsx_runtime_1.jsx(jsx_runtime_1.Fragment, { children: jsx_runtime_1.jsx(react_final_form_1.Form, { name: "twitchConfig", render: function (_a) {
                var handleSubmit = _a.handleSubmit;
                return (jsx_runtime_1.jsx("form", __assign({ onSubmit: function (e) { return handleSubmit(e); }, action: "#", method: "get", id: "configForm" }, { children: displayConfig ? (jsx_runtime_1.jsxs(jsx_runtime_1.Fragment, { children: [jsx_runtime_1.jsxs("section", __assign({ className: "configSection" }, { children: [jsx_runtime_1.jsx(react_final_form_1.Field, { type: "text", defaultValue: "", placeholder: "user token", id: "token", name: "token", component: Input, validate: checkLength }, void 0), jsx_runtime_1.jsx(react_final_form_1.Field, { type: "text", defaultValue: "", placeholder: "username", id: "username", name: "username", component: Input, validate: checkLength }, void 0)] }), void 0), jsx_runtime_1.jsxs("p", { children: ["Click ", jsx_runtime_1.jsx("a", { children: "here" }, void 0), " to get token"] }, void 0), jsx_runtime_1.jsx("button", { children: "append config" }, void 0)] }, void 0)) : (jsx_runtime_1.jsx("button", __assign({ onClick: function () { return setDisplayConfig(!displayConfig); }, type: "button", id: "showConfig" }, { children: "Show Config" }), void 0)) }), void 0));
            }, onSubmit: function (e) { return handleSubmit(e, Console, setDisplayConfig); } }, void 0) }, void 0));
};
exports.TimerConfig = TimerConfig;
//# sourceMappingURL=TimerConfig.js.map