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
exports.Navigation = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var Navigation = function () {
    return (jsx_runtime_1.jsx("nav", { children: jsx_runtime_1.jsxs("ol", { children: [jsx_runtime_1.jsx(react_router_dom_1.Link, __assign({ to: "/" }, { children: jsx_runtime_1.jsx("li", { children: "Timer" }, void 0) }), void 0), jsx_runtime_1.jsx(react_router_dom_1.Link, __assign({ to: "/shortcuts" }, { children: jsx_runtime_1.jsx("li", { children: "Shortcuts" }, void 0) }), void 0)] }, void 0) }, void 0));
};
exports.Navigation = Navigation;
//# sourceMappingURL=Navigation.js.map