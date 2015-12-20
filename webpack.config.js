var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Webpack = require('webpack');

var dev = true; // Temp

var config = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'babel-polyfill/dist/polyfill',
        './src/app/app',
        './src/assets/styles/main'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
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
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                cacheDirectory: true,
                plugins: [
                    ['react-transform', {
                        // omit HMR plugin by default and _only_ load in hot mode
                        transforms: [{
                            'transform': 'react-transform-hmr',
                            'imports': ['react'],
                            'locals': ['module']
                        }, {
                            transform: 'react-transform-catch-errors',
                            imports: ['react', 'redbox-react']
                        }]
                    }]
                ],
                presets: ['es2015', 'react', 'stage-0']
            }
        }, {
            test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff2?$|\.ttf$|\.eot$/,
            loader: 'file'
        }]
    }
};

if (dev) {
    config.entry.unshift('webpack-hot-middleware/client');
    config.module.loaders.push({
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
    });
} else {
    config.plugins.push(
        new ExtractTextPlugin('static/styles.css')
    );

    config.module.loaders.push({
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
    });
}

module.exports = config;
