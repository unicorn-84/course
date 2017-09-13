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
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');
const order = require('gulp-order');
const svgSprite = require('gulp-svg-sprites');

const isDevelopment = false;


/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor":
 ["file"] }] */


// CLEAN
gulp.task('clean', () => del('build'));


// HTML
gulp.task('html', () => (
  combiner(
    gulp.src('src/*.html', { since: gulp.lastRun('html') }),
    htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
    }),
    gulp.dest('build')).on('error', notify.onError())
));


// STYLES
gulp.task('styles', () => (
  combiner(
    gulp.src(['src/styles/less/custom.less', 'src/styles/scss/main.scss']),
    gulpIf(isDevelopment, sourcemaps.init()),
    gulpIf('custom.less', less()),
    gulpIf('main.scss', sass()),
    order(['custom.css', 'main.css']),
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
        2: {},
      },
    }),
    gulpIf(isDevelopment, sourcemaps.write()),
    gulp.dest('build/styles')).on('error', notify.onError())
));


// SCRIPTS
gulp.task('scripts', () => (
  combiner(
    gulp.src(['src/scripts/**/*.js', 'src/service-worker.js'], { since: gulp.lastRun('webp') }),
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
    gulp.dest(file => (
      file.basename === 'service-worker.js' ? 'build' : 'build/scripts'
    ))).on('error', notify.onError())
));


// IMAGES
gulp.task('webp', () => (
  combiner(
    gulp.src(['src/images/**/*.*', '!src/images/icons/**/*.*'], { since: gulp.lastRun('webp') }),
    imagemin([
      imageminWebp(),
    ], { verbose: true }),
    gulp.dest((file) => {
      file.extname = '.webp';
      return 'build/images';
    })).on('error', notify.onError())
));

gulp.task('jpg', () => (
  combiner(
    gulp.src('src/images/**/*.jpg', { since: gulp.lastRun('jpg') }),
    imagemin([
      imageminJpegRecompress(),
    ], { verbose: true }),
    gulp.dest((file) => {
      file.path = file.base + file.basename;
      return 'build/images';
    })).on('error', notify.onError())
));

gulp.task('png', () => (
  combiner(
    gulp.src('src/images/**/*.png', { since: gulp.lastRun('png') }),
    imagemin([
      imageminPngquant(),
    ], { verbose: true }),
    gulp.dest((file) => {
      file.path = file.base + file.basename;
      return 'build/images';
    })).on('error', notify.onError())
));

gulp.task('images', gulp.parallel('webp', 'jpg', 'png'));


// VIDEO
gulp.task('video', () => (
  combiner(
    gulp.src('src/video/**/*.*', { since: gulp.lastRun('video') }),
    gulp.dest('build/video')).on('error', notify.onError())
));


// ASSETS
gulp.task('assets', () => (
  combiner(
    gulp.src('src/*.json', { since: gulp.lastRun('assets') }),
    gulp.dest('build')).on('error', notify.onError())
));

// FONTS
gulp.task('fonts', () => (
  combiner(
    gulp.src('src/fonts/**/*.*', { since: gulp.lastRun('fonts') }),
    gulp.dest('build/fonts')).on('error', notify.onError())
));


// SVG
gulp.task('svg', () => (
  combiner(
    gulp.src('src/images/icons/*.svg', { since: gulp.lastRun('svg') }),
    svgSprite({
      mode: 'symbols',
      preview: false,
    }),
    gulp.dest((file) => {
      file.path = file.base + file.basename;
      return 'build/images';
    })).on('error', notify.onError())
));


// SERVE
gulp.task('serve', () => {
  browserSync.init({
    server: 'build',
  });
  browserSync.watch('build/**/*.*', (event) => {
    if (event === 'change') {
      browserSync.reload();
    }
  });
});


// WATCH
gulp.task('watch', () => {
  gulp.watch('src/styles/**/*.*', gulp.series('styles'));
  gulp.watch('src/scripts/**/*.*', gulp.series('scripts'));
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('src/*.json', gulp.series('assets'));
  gulp.watch('src/images/**/*.{jpg,png}', gulp.series('images'));
  gulp.watch('src/fonts/**/*.*', gulp.series('fonts'));
  gulp.watch('src/video/**/*.*', gulp.series('video'));
  gulp.watch('src/images/icons/*.svg', gulp.series('svg'));
});


// BUILD
gulp.task('build', gulp.series('clean', gulp.parallel('images', 'video', 'html', 'styles', 'scripts', 'assets', 'fonts', 'svg')));


// DEV
gulp.task('dev', gulp.series('build', gulp.parallel('serve', 'watch')));

