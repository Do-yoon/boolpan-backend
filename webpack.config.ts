import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import * as path from "path"

import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
const isProduction = process.env.NODE_ENV === 'production';

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
    entry: {
        index: {
            import: './src/server.ts',
        },
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-typescript', { targets: "defaults" }],
                        ],
                    }
                }
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.html$/i,
                use: "html-loader",
            },
            {
                test: /\.(ttf|jpg|png)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        name: '[name].[ext]?[hash]',
                        limit: 10000
                    }
                },
            }
        ],
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        port: 3000
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[id].chunk.js',
    },
    devtool: 'inline-source-map',
    optimization: {
        runtimeChunk: 'single',
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
        plugins: [new TsconfigPathsPlugin({ configFile: 'src/tsconfig.json' })]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/index.html'
        })
    ]
};

module.exports = (isProduction
    ? {
        ...config,
        mode: 'production'
    }
    : {
            ...config,
            mode: 'development'
    }
    );
