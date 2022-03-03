var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    resolve: {
        mainFiles: ['index', 'Index'],
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        }
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html',
    })],
    devServer: {
        allowedHosts: [
            'host.com',
            'subdomain.host.com',
            'subdomain2.host.com',
            'host2.com'
        ],
        host: 'localhost',
        historyApiFallback: true,
        inline: false,
        port: 8000
    },
    externals: {
        config: JSON.stringify({
            apiUrl: 'http://localhost:4000'
        }),
    },
}