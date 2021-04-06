/*
Copyright 2021 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const process = require('process');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (source, dest, dev) => ({
    devtool: 'source-map',
    mode: dev ? 'development' : 'production',
    entry: {
        'mount.js': path.join(source, 'mount.js'),
    },
    output: {
        path: dest,
        publicPath: './',
        filename: '[name]',
    },
    optimization: {
        minimize: true,
        minimizer: [
            '...',
            new CssMinimizerPlugin(),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(ttf|eot|woff2?)$/,
                use: {
                    loader: 'file-loader',
                },
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'react-svg-loader',
                        options: {
                            jsx: true,
                        },
                    },
                ],
            },
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                },
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'resolve-url-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'resolve-url-loader'],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.ya?ml$/,
                use: 'yaml-loader',
                type: 'json',
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            sources: false,
                            minimize: false,
                        },
                    },
                    {
                        loader: 'posthtml-loader',
                        options: {
                            config: {
                                path: process.cwd(),
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            fs: require.resolve('browserify-fs'),
            buffer: require.resolve('buffer/'),
            util: require.resolve('util/'),
            stream: require.resolve('stream-browserify'),
            events: require.resolve('events/'),
            constants: require.resolve('constants-browserify'),
        },
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css', '.scss', '.sass', '.html', '.vue', '.yml', '.yaml'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.HotModuleReplacementPlugin(),
        new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: 'style.css' }),
        new HtmlWebpackPlugin({
            template: path.join(source, 'index.html'),
            inject: false,
            minify: false,
        }),
    ],
});