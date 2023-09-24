const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: {
        'refresh': './src/refresh.ts',
        'clear-cache': './src/clear-cache.ts',
    },
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
