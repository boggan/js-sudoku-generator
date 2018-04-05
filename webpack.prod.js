const
    webpack = require("webpack"),
    path = require("path"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    BUILD_DIR = path.resolve(__dirname, "dist/"),
    SRC_DIR = path.resolve(__dirname, "src/");

let l_oNodeBuild = {
        mode: "production",
        entry: path.join(SRC_DIR, "SudokuGenerator.js"),
        output: {
            path: BUILD_DIR,
            libraryTarget: "umd",
            filename: "js-sudoku-generator.js",
        },
        devtool: 'none', // remove from production build
        target: 'node',
        plugins: [
        new CleanWebpackPlugin([BUILD_DIR], {
                verbose: false
            }),
        // production
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            })
    ]
    },
    l_oWebBuild = {
        mode: "production",
        entry: path.join(SRC_DIR, "SudokuGenerator.js"),
        output: {
            path: BUILD_DIR,
            libraryTarget: "umd",
            filename: "js-sudoku-generator.web.js",
        },
        devtool: 'none', // remove from production build
        target: 'web',
        module: {
            rules: [{
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader'
                }]
            }]
        },
        plugins: [
        // production
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            })
    ]
    };

// config to build sudoku generator
module.exports = [l_oNodeBuild, l_oWebBuild];
