const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const properties  = require('./properties');

// Static Server + watching scss/html files
gulp.task('serve', function() {

  browserSync.init({
      proxy: `${properties.HOST}:${properties.PORT}`
  });

  gulp.watch("public/sass/**/*.sass", ['sass']);
  gulp.watch("public/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("public/sass/main.sass")
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest("public/css/"))
    .pipe(browserSync.stream());
});

gulp.task('default', ['sass', 'serve']);