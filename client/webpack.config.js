const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev=process.env.NODE_ENV==='development';
const isProd=!isDev;

module.exports = {
    context: path.resolve(__dirname),
    mode: "development",
    entry: ['@babel/polyfill', `./src/index.js`],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].[hash].js",
        publicPath: '/'
    },
    devServer: {
        port: 3000,
        historyApiFallback: true,
        proxy: {
            "/": {
                target: "http://localhost:5000"
            }
        }
    },
    resolve: {
        extensions: ['.jsx', '.js', '.json']
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new HTMLWebpackPlugin({ 
                template: `${__dirname}/public/index.html`,
                minify: isProd
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: path.resolve(__dirname, 'public/favicon.ico'),
                        to: path.resolve(__dirname, 'dist')
                    },
                    {
                        from: path.resolve(__dirname, 'public/logo256.png'),
                        to: path.resolve(__dirname, 'dist')
                    }
                ]
            })
    ],
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpg|jpeg|png|svg)$/,
                use: ["file-loader"]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", ["@babel/preset-react", {
                            "runtime": "automatic"
                         }]]
                    }
                }
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            }
        ]
    }
}