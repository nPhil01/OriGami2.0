var gulp = require('gulp');
var webserver = require('gulp-webserver');
var watch = require('gulp-watch');
var del = require('del');

gulp.task('clean', function (cb) {
  del(['dist']);
  cb();
});

gulp.task('webserver', function () {
  var stream = gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
  return stream;
});

gulp.task('watch', function () {
  return gulp.src('www/**/*')
    .pipe(watch('www/**/*'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function (cb) {
  gulp.src('www/**/*')
    .pipe(gulp.dest('dist'));
  cb();
});

gulp.task('dev', ['clean', 'copy', 'watch', 'webserver']);
