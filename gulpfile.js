var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    insert = require('gulp-insert'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    run = require('run-sequence'),
    strip = require('gulp-strip-comments'),
    ngAnnotate = require('gulp-ng-annotate');

var PREPEND = "(function() {'use strict'\n\n";
var APPEND  = "\n})();";

gulp.task('build:dev', function() {
  return gulp.src('./src/**/*')
  .pipe(concat('nonbox-client.js'))
  .pipe(insert.prepend(PREPEND))
  .pipe(insert.append(APPEND))
  .pipe(gulp.dest('./'));
});

gulp.task('build:prod', function() {
  return gulp.src('./src/**/*')
    .pipe(strip())
    .pipe(ngAnnotate())
    .pipe(concat('nonbox-client.min.js'))
    .pipe(insert.prepend(PREPEND))
    .pipe(insert.append(APPEND))
    .pipe(uglify({mangle:true}))
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    }).pipe(gulp.dest('./'));
});

gulp.task('build', ['build:dev', 'build:prod'], function() {
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['build']);
});

gulp.task('default', function(cb) {
  run('build', 'watch', cb);
});
