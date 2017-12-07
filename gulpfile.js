'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var babelify = require('babelify');

gulp.task('bundle', function () {
    var bundler = browserify('./app/js/app.js')  // Pass browserify the entry point  
    .transform(babelify, { presets : [ 'es2015' ] });                         
    bundle(bundler);  // Chain other options -- sourcemaps, rename, etc.
})

function bundle (bundler) {

    // Add options to add to "base" bundler passed as parameter
    bundler
      .bundle()
      .on('error', function(err){
        console.log(err.message);
        this.emit('end');
      })
      .pipe(source('./app/js/app.js')) // Entry point
      .pipe(buffer()) // Convert to gulp pipeline
      .pipe(rename('build.js')) // Rename output
      .pipe(gulp.dest('build')) // Save 'bundle' to build/
}
 
gulp.task('browserify', function() {
    // Single entry point to browserify 
    gulp.src('./app/js/app.js')
        .pipe(browserify({
        }))
        .pipe(gulp.dest('./build'))
});

gulp.task('sass', function () {
    return gulp.src('app/sass/app.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('app/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});


gulp.task('default', function () {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    // gulp.start('browserify');
    gulp.watch(['app/js/**/*.js','class/*.js'], ['bundle']);
    gulp.start('webserver');
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});