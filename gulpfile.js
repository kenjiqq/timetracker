'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    webpackConfig = require('./webpack.config.js');

gulp.task('webpack', function(callback) {
    webpack(webpackConfig, function(err, stats) {
        if(err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({
        }));
        callback();
    });
});

gulp.task('webpack-dev-server', function(callback) {
	webpackConfig.devtool = 'eval';
	webpackConfig.debug = true;
    new WebpackDevServer(webpack(webpackConfig), {
        publicPath: webpackConfig.output.publicPath,
        contentBase: 'dist',
        hot: true,
        historyApiFallback: true,
		stats: {
			colors: true
		}
    }, {
    }).listen(3000, 'localhost', function(err) {
        if(err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        gutil.log('[webpack-dev-server]', 'http://localhost:3000/webpack-dev-server/index.html');
    });
});

gulp.task('default', function () {
    gulp.start('webpack-dev-server');
});

gulp.task('dist', function () {
    gulp.start('webpack');
});
