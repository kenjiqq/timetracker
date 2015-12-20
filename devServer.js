var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    quiet: false,
    hot: true,
    publicPath: config.output.publicPath,
    lazy: false,
    stats: {
        chunks: false,
        chunkModules: false,
        colors: true
    }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(path.join(__dirname, 'dist/')));

app.listen(3000, 'localhost', function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:3000');
});
