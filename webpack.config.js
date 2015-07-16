var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    Webpack = require('webpack');

var dev = true; //Temp

var config = {
    entry: [
        './src/app/app',
        './src/assets/styles/main'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'static/bundle.js',
    },
    resolve: {
        extensions: ['', '.js', '.scss']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: 'body'
        }),
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['react-hot', 'babel'],
            exclude: /node_modules/
        }, {
            test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff2?$|\.ttf$|\.eot$/,
            loader: "file"
        }, ]
    }
};

if (dev) {
    config.entry.push(
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server'
    );
    config.module.loaders.push({
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
    });
} else {
    config.plugins.push(
        new ExtractTextPlugin('static/styles.css')
    );

    config.module.loaders.push({
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("css!sass")
    });
}

module.exports = config;
