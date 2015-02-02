'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    sass = require('gulp-sass'),
    connect = $.connectMulti,
    wiredep = require('wiredep').stream,
    devServer = connect(),
    proServer = connect();

gulp.task('connect-dev', devServer.server({
    root: ['src', 'build'],
    port: 8989,
    livereload: true
}));

gulp.task('connect-pro', proServer.server({
    root: ['dist'],
    port: 9090,
    livereload: true
}));

gulp.task('clean', function() {
    return gulp.src(['dist'], {
            read: false
        })
        .pipe($.rimraf());
});

gulp.task('robots', function() {
    gulp.src('src/robots.txt')
        .pipe(gulp.dest('dist/'));
});

gulp.task('static', function() {
    gulp.src('src/static/*')
        .pipe(gulp.dest('dist/static/'));
});

gulp.task('config', function() {
    gulp.src('src/config/*')
        .pipe(gulp.dest('dist/config/'));
});

gulp.task('fonts', function() {
    gulp.src('src/bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('images', function() {
    gulp.src('src/assets/images/*')
        .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('sass', function () {
    gulp.src('src/assets/styles/*.scss')
        .pipe(sass({
            includePaths: ['src/bower_components/bootstrap-sass/assets/stylesheets']
        }))
        .on('error', function(err){
          console.log(err.message);
        })
        .pipe(gulp.dest('build/css'));
});

gulp.task('css', function () {
    gulp.src('build/css/*')
        .pipe(gulp.dest('dist/assets/css'));
})

gulp.task('base', ['robots', 'static', 'config', 'fonts', 'images', 'sass']);

gulp.task('scripts', function() {
    return gulp.src(['src/app/app.js'])
        .pipe($.browserify({
            transform: ['reactify'],
            extensions: ['.jsx']
        }))
        .on('prebundle', function(bundler) {
            bundler.require('react');
        })
        .pipe(gulp.dest('dist/scripts/'))
        .pipe($.size());
});

gulp.task('html', ['base', 'scripts'], function() {
    var assets = $.useref.assets();
    return gulp.src('src/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('compress', ['html'], function() {
    gulp.src(['dist/scripts/app.js', 'dist/scripts/vendor.js'])
        .pipe($.uglify())
        .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('wiredep', function() {
    gulp.src('src/*.html')
        .pipe(wiredep({
            directory: 'src/bower_components',
            ignorePath: 'src/'
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('browserify', function() {
    return gulp.src(['src/app/app.js'])
        .pipe($.browserify({
            transform: ['reactify'],
            extensions: ['.jsx']
        }))
        .on('prebundle', function(bundler) {
            bundler.require('react');
        })
        .on('error', function(err){
          console.log(err.message);
          this.end();
        })
        .pipe(gulp.dest('build/scripts/'))
        .pipe($.size());
});

gulp.task('refresh', ['browserify'], function() {
    gulp.src('build/scripts/app.js')
        .pipe(devServer.reload());
});

gulp.task('watch', ['connect-dev'], function() {
    gulp.watch([
        'src/*.html',
        'build/css/*.css',
        'src/assets/images/*',
        'build/scripts/*.js',
    ], function(event) {
        return gulp.src(event.path)
            .pipe(devServer.reload());
    });

    gulp.watch(['src/assets/styles/*.scss'], ['sass']);
    gulp.watch(['src/app/*.js', 'src/app/**/*.js', 'src/app/**/*.jsx'], ['refresh']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('development', ['browserify', 'sass'], function() {
    gulp.start('watch');
});

gulp.task('build', ['compress'], function() {
    gulp.start('connect-pro');
});

gulp.task('production', ['clean'], function() {
    gulp.start('build');
});
