const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: fs
        .readdirSync(path.resolve('src'), 'utf8')
        .filter(n => n.endsWith('.ts'))
        .reduce(
            (map, n) => ({
                ...map,
                [n.replace(/\.ts$/, '')]: path.resolve('src', n),
            }),
            {},
        ),
    output: {
        path: path.resolve('dist'),
    },
    target: 'node',
    mode: isDev ? 'development' : 'production',
    devtool: isDev && 'eval-source-map',
    plugins: [new CleanWebpackPlugin()],
    module: {
        rules: [
            {
                test: /\.[jt]s$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-typescript'],
                        sourceMap: isDev,
                    },
                },
            },
        ],
    },
    resolve: {
        alias: {
            src: path.resolve('src'),
        },
        extensions: ['.js', '.ts'],
    },
};
