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
  gulp.src('src/*.html', { since: gulp.lastRun('html') })
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest('./build')),
);

gulp.task('styles', () =>
  gulp.src('./src/styles/main.scss')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: {
        1: {
          specialComments: 0,
        },
      },
    }))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('./build/styles')),
);

gulp.task('scripts', () =>
  gulp.src('./src/scripts/*.js')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(babel({
      presets: [
        ['env', {
          targets: {
            browsers: ['last 2 versions'],
          },
        }],
        ['es2015'],
      ],
    }))
    .pipe(uglify())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('./build/scripts')),
);
gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'scripts', 'html')));

gulp.task('watch', () => {
  gulp.watch('./src/styles/**/*.*', gulp.series('styles'));
  gulp.watch('./src/scripts/**/*.*', gulp.series('scripts'));
  gulp.watch('./src/*.html', gulp.series('html'));
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
