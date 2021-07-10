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
exports.Inputs = exports.handleSubmit = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_final_form_1 = require("react-final-form");
var App_1 = require("../App");
var electron_1 = require("electron");
var Input = function (props) {
    return (jsx_runtime_1.jsx("input", __assign({}, props.input, props.inputProps, { type: props.input.type, className: props.className, id: props.input.id, min: props.min, max: props.max, placeholder: props.placeholder }), void 0));
};
var checkLength = function (value) {
    if (!value || value <= 0) {
        return "wypełnij coś debilu";
    }
    return undefined;
};
var handleSubmit = function (e, Console) {
    console.log(e);
    Console.log("Updating timer: " + JSON.stringify(e));
    if (e && e.fontSize) {
        electron_1.ipcRenderer.send("timer:updateFont", e);
    }
    else {
        electron_1.ipcRenderer.send("timer:updateClock", e);
    }
};
exports.handleSubmit = handleSubmit;
var Inputs = function () {
    var Console = react_1.useContext(App_1.consoleContext);
    return (jsx_runtime_1.jsxs(jsx_runtime_1.Fragment, { children: [jsx_runtime_1.jsx(react_final_form_1.Form, { name: "timer", render: function (_a) {
                    var handleSubmit = _a.handleSubmit;
                    return (jsx_runtime_1.jsxs(jsx_runtime_1.Fragment, { children: [jsx_runtime_1.jsxs("form", __assign({ action: "#", onSubmit: function (e) { return handleSubmit(e); } }, { children: [jsx_runtime_1.jsxs("section", { children: [jsx_runtime_1.jsx(react_final_form_1.Field, { parse: function (n) { return parseInt(n); }, name: "hours", type: "number", defaultValue: 0, id: "hours", min: 0, max: 23, className: "time", component: Input }, void 0), jsx_runtime_1.jsx(react_final_form_1.Field, { parse: function (n) { return parseInt(n); }, name: "minutes", className: "time", defaultValue: 0, min: 0, max: 59, type: "number", id: "minutes", component: Input }, void 0), jsx_runtime_1.jsx(react_final_form_1.Field, { parse: function (n) { return parseInt(n); }, name: "seconds", className: "time", defaultValue: 0, min: 0, max: 59, type: "number", id: "seconds", component: Input }, void 0)] }, void 0), jsx_runtime_1.jsx("button", __assign({ type: "submit" }, { children: "Update Time" }), void 0)] }), void 0), jsx_runtime_1.jsx("br", {}, void 0)] }, void 0));
                }, onSubmit: function (e) { return exports.handleSubmit(e, Console); } }, void 0), jsx_runtime_1.jsx(react_final_form_1.Form, { name: "font", render: function (_a) {
                    var handleSubmit = _a.handleSubmit;
                    return (jsx_runtime_1.jsx(jsx_runtime_1.Fragment, { children: jsx_runtime_1.jsxs("form", __assign({ onSubmit: function (e) { return handleSubmit(e); }, action: "#", method: "get", id: "fontForm" }, { children: [jsx_runtime_1.jsx("section", { children: jsx_runtime_1.jsx(react_final_form_1.Field, { parse: function (n) { return parseInt(n); }, name: "fontSize", type: "number", id: "fontSize", min: "1", validate: checkLength, component: Input, placeholder: "rozmiar czcionki" }, void 0) }, void 0), jsx_runtime_1.jsx("button", __assign({ type: "submit" }, { children: "Update Font Size" }), void 0)] }), void 0) }, void 0));
                }, onSubmit: function (e) { return exports.handleSubmit(e, Console); } }, void 0)] }, void 0));
};
exports.Inputs = Inputs;
//# sourceMappingURL=Inputs.js.map