const
    webpack = require("webpack"),
    path = require("path"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    BUILD_DIR = path.resolve(__dirname, "dist/"),
    SRC_DIR = path.resolve(__dirname, "src/");

let l_oNodeBuild = {
        mode: "development",
        entry: path.join(SRC_DIR, "SudokuGenerator.js"),
        output: {
            path: BUILD_DIR,
            libraryTarget: "umd",
            filename: "js-sudoku-generator.js",
        },
        devtool: 'inline-source-map',
        target: 'node',
        plugins: [
        new CleanWebpackPlugin([BUILD_DIR], {
                verbose: false
            })]
    },
    l_oWebBuild = {
        mode: "development",
        entry: path.join(SRC_DIR, "SudokuGenerator.js"),
        output: {
            path: BUILD_DIR,
            libraryTarget: "umd",
            filename: "js-sudoku-generator.web.js",
        },
        devtool: 'inline-source-map',
        target: 'web',
        module: {
            rules: [{
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader'
                }]
            }]
        },
        plugins: []
    };

// config to build sudoku generator
module.exports = [l_oNodeBuild, l_oWebBuild];
