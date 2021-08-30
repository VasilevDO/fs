const path=require('path');
const {CleanWebpackPlugin}=require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports={
    mode:"development",
    entry:['@babel/polyfill',`${__dirname}/client/src/index.js`],
    output:{
        path:path.resolve(`${__dirname}/client`,"dist"),
        filename:"[name].[hash].js"
    },
    devServer: {
        port:3000
    },
    resolve: {
        extensions: ['.jsx','.js','.json']
    },
    plugins: [
        new HtmlWebpackPlugin({template:`${__dirname}/client/src/index.html`}),
        new CleanWebpackPlugin()
    ],
    module: {
        rules:[
            {
                test:/\.(css|less)$/,
                use:["style-loader","css-loader"]
            },
            {
                test:/\.(jpg|jpeg|png|svg)$/,
                use:["file-loader"]
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:"babel-loader",
                    options: {
                        presets:['@babel/preset-env',"@babel/preset-react"]
                    }
                }
            },
            {
                test:/\.jsx$/,
                exclude:/node_modules/,
                use:{
                    loader:"babel-loader",
                    options: {
                        presets:['@babel/preset-react','@babel/preset-env']
                    }
                }
            },
        ]   
    }
}