
"use strict"

var gulp = require('gulp');
var watch = require('gulp-watch');
var replace = require('gulp-replace');
var htmlmin = require('gulp-htmlmin');
var minify_css = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');



var html_min_options = {
    removeComments : true,
    removeCommentsFromCDATA : true,
    removeCDATASectionsFromCDATA : true,
    collapseWhitespace : true,
    conservativeCollapse : true,
    keepClosingSlash : true,
    ignoreCustomComments : [/^#/, /^@/, /^%/],
    preventAttributesEscaping : true,
    collapseBooleanAttributes : false
};



gulp.task('watch', function() {

    gulp.watch('./sass/*.scss',['compile_sass']);
    gulp.watch('./css/*.css',['build_css']);
    gulp.watch('./html/*.html',['build_template']);
    gulp.watch('./js/*.js', ['build_js']);
});



gulp.task('compile_sass',function(){

    gulp.src('./sass/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./css'));

});


gulp.task('build_template', function(){
    gulp.src('./html/*.html')
        .pipe(replace(/\|cond=/g, ' xpressengine-tpl-cond='))
        .pipe(htmlmin(html_min_options))
        .on('error', ignore_error)
        .pipe(replace(/ xpressengine-tpl-cond=/g,'|cond='))
        .pipe(gulp.dest('../'));
});


gulp.task('build_js', function(){
    gulp.src('./js/*.js')
        .pipe(concat('moedit.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('../js/'))

});

// CSS BUILD
gulp.task('build_css', function() {
    gulp.src('./css/*.css')
      //  .pipe(minify_css())
        .pipe(rename('moedit.min.css'))
        .pipe(gulp.dest('../css/'))
});


var ignore_error = function (error) {
    console.log(JSON.stringify(error));
    this.emit('end');
}
