const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: './src/js/index.js',
    module: {
        rules: [
            { test: /\.(png|jpe?g|gif|svg)$/i, type: 'asset/resource' },
            {
                test: /\.css$/i,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader'
                ]
            },
            { test: /\.(js)$/, use: 'babel-loader' }
        ]
    },
    output: {
        filename: isProd ? '[name].[contenthash].js' : '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.png'
        }),
        ...(isProd ? [new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })] : [])
    ],
    mode: isProd ? 'production' : 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        open: true,
        hot: true,
        port: 8080,
    },
    optimization: {
        minimize: isProd,
        minimizer: [
            '...',
            ...(isProd ? [new CssMinimizerPlugin()] : [])
        ]
    }
};
