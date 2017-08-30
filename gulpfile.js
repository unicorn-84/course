const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const less = require('gulp-less');
const concatCss = require('gulp-concat-css');
const combiner = require('stream-combiner2').obj;

const isDevelopment = true;

gulp.task('clean', (callback) => {
  del('./build');
  callback();
});

gulp.task('serve', () => {
  browserSync.init({
    server: './build',
  });
  browserSync.watch('./build/**/*.*', (event) => {
    if (event === 'change') {
      browserSync.reload();
    }
  });
});

gulp.task('html', () =>
  combiner(
    gulp.src('./src/*.html', { since: gulp.lastRun('html') }),
    htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }),
    gulp.dest('./build')),
);

gulp.task('styles', () =>
  combiner(
    gulp.src('./src/styles/**/main.{scss,less}'),
    gulpIf(isDevelopment, sourcemaps.init()),
    gulpIf('*.less', less(), sass()),
    concatCss('main.css'),
    autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }),
    cleanCSS({
      level: {
        1: {
          specialComments: 0,
        },
      },
    }),
    gulpIf(isDevelopment, sourcemaps.write()),
    gulp.dest('./build/styles')),
);

gulp.task('scripts', () =>
  combiner(
    gulp.src('./src/scripts/*.js'),
    gulpIf(isDevelopment, sourcemaps.init()),
    babel({
      presets: [
        ['env', {
          targets: {
            browsers: ['last 2 versions'],
          },
        }],
        ['es2015'],
      ],
    }),
    uglify(),
    gulpIf(isDevelopment, sourcemaps.write()),
    gulp.dest('./build/scripts')),
);

gulp.task('build', gulp.series('clean', 'styles', gulp.parallel('scripts', 'html')));

gulp.task('watch', () => {
  gulp.watch('./src/styles/**/*.*', gulp.series('styles'));
  gulp.watch('./src/scripts/**/*.*', gulp.series('scripts'));
  gulp.watch('./src/*.html', gulp.series('html'));
});

gulp.task('dev', gulp.series('build', gulp.parallel('serve', 'watch')));
