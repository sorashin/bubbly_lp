var
gulp = require('gulp'),
coffee = require('gulp-coffee'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
browser = require('browser-sync'),
plumber = require("gulp-plumber"),
 
gifsicle = require('imagemin-gifsicle'),
jpegtran = require('imagemin-jpegtran'),
optipng = require('imagemin-optipng'),
svgo = require('imagemin-svgo'),
 
fileinclude = require('gulp-file-include'),
prettify = require('gulp-prettify'),
cssbeautify = require('gulp-cssbeautify'),
jsprettify = require('gulp-jsbeautifier'),
changed = require('gulp-changed'),
del = require('del')
;
 
var paths = {
    base:'/project/',
    scss  :'app/**/*.scss',
    js    :'app/**/*.js',
    coffee:'app/**/*.coffee',
    html  :'app/**/*.html',
    image :'app/**/img/*',
    dist  :'./dist'
};
 
gulp.task('server', function() {
    browser({server: {baseDir: paths.dist}});
});
 
gulp.task('image', function() {
    gulp
    .src(paths.image)
    .pipe(plumber())
    .pipe(changed(paths.dist))
    .pipe(gifsicle())
    .pipe(jpegtran())
    .pipe(optipng())
    .pipe(svgo())
    .pipe(gulp.dest(paths.dist))
    .pipe(browser.reload({stream:true}));
});
 
gulp.task('sass', function() {
    gulp
    .src(paths.scss)
    .pipe(plumber())
    .pipe(changed(paths.dist))
    .pipe(fileinclude({basepath: paths.base}))
    //（2014.11.20追記）
    .pipe(sass({
        errLogToConsole: true,
        sourceComments: 'normal'
    }))
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(gulp.dest(paths.dist))
    .pipe(browser.reload({stream:true}));
});
 
gulp.task('coffee', function() {
    gulp
    .src(paths.coffee)
    .pipe(plumber())
    .pipe(changed(paths.dist))
    .pipe(fileinclude({basepath: paths.base}))
    .pipe(coffee())
    .pipe(gulp.dest(paths.dist))
    .pipe(browser.reload({stream:true}));
});
 
gulp.task('js', function() {
    gulp
    .src(paths.js)
    .pipe(plumber())
    .pipe(changed(paths.dist))
    .pipe(fileinclude({basepath: paths.base}))
    .pipe(jsprettify())
    .pipe(gulp.dest(paths.dist))
    .pipe(browser.reload({stream:true}));
});
 
gulp.task('html', function() {
    gulp
    .src(paths.html)
    .pipe(plumber())
    .pipe(changed(paths.dist))
    .pipe(fileinclude({basepath: paths.base}))
    .pipe(prettify())
    .pipe(gulp.dest(paths.dist))
    .pipe(browser.reload({stream:true}));
});
 
gulp.task('clean', function(cb) {
  // del(paths.dist, cb);
});
 
gulp.task('watch', function() {
    gulp.watch(paths.scss,['sass']);
    gulp.watch(paths.coffee,['coffee']);
    gulp.watch(paths.html,['html']);
    gulp.watch(paths.js,['js']);
    gulp.watch(paths.image,['image']);
});
 
gulp.task('build', ['clean'], function(){
    gulp.start('create');
});
 
gulp.task('create', ['sass','coffee','html','js','image']);
gulp.task('default', ['build','watch','server']);