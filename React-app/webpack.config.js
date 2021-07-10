const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = {
    entry: "./src/index.tsx", // entry point of our application
    output: {
        // end point where webpack will bundle code
        path: path.resolve(__dirname, "out/src"),
        filename: "main.js",
    },
    mode: "development",
    resolve: {
        // this field specifies file types for bundling
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    module: {
        // thie field explains webpack how to treat diffrent modules
        rules: [
            {
                test: /\.(ts|tsx)$/, // this tels how to treat typescript files
                loader: "ts-loader",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"),
        }),
        new webpack.ExternalsPlugin("commonjs", ["electron"]),
    ],
};
