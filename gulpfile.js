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
const debug = require('gulp-debug');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const order = require('gulp-order');

const isDevelopment = false;

gulp.task('clean', (callback) => {
  del('build');
  cache.clearAll();
  callback();
});

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

gulp.task('html', () =>
  combiner(
    gulp.src('src/*.html', { since: gulp.lastRun('html') }),
    htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
    }),
    debug({ title: 'html' }),
    gulp.dest('build'))
    .on('error', notify.onError()),
);

gulp.task('styles', () =>
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
      },
    }),
    gulpIf(isDevelopment, sourcemaps.write()),
    debug({ title: 'css' }),
    gulp.dest('build/styles'))
    .on('error', notify.onError()),
);

gulp.task('scripts', () =>
  combiner(
    gulp.src(['src/scripts/*.js', 'src/service-worker.js']),
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
    debug({ title: 'scripts' }),
    gulp.dest(file => (file.basename === 'service-worker.js' ? 'build' : 'build/scripts')))
    .on('error', notify.onError()),
);

gulp.task('images', () =>
  combiner(
    gulp.src('src/images/**/*.*', { since: gulp.lastRun('images') }),
    cache(imagemin([
      imageminJpegRecompress({ max: 70 }),
      imageminPngquant({ quality: 70 }),
    ], { verbose: true })),
    debug({ title: 'images' }),
    gulp.dest('build/images'))
    .on('error', notify.onError()),
);

gulp.task('json', () =>
  combiner(
    gulp.src('src/**/*.json', { since: gulp.lastRun('json') }),
    debug({ title: 'json' }),
    gulp.dest('build'))
    .on('error', notify.onError()),
);

gulp.task('build', gulp.series('clean', 'images', 'styles', 'scripts', 'html', 'json'));

gulp.task('watch', () => {
  gulp.watch('src/styles/**/*.*', gulp.series('styles'));
  gulp.watch('src/scripts/**/*.*', gulp.series('scripts'));
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('./src/images/**/*.*', gulp.series('images'));
});

gulp.task('dev', gulp.series('build', gulp.parallel('serve', 'watch')));
