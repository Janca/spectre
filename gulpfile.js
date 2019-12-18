const gulp = require('gulp');
const sass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const csscomb = require('gulp-csscomb');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');

const p = {
    sass: {
        src: './src/*.scss',
        dst: './dist'
    },
    docPug: {
        src: './docs/src/**/!(_)*.pug',
        dst: './docs'
    },
    docSass: {
        src: './docs/src/scss/*.scss',
        dst: './docs/dist'
    }
};

const buildStyle = (src, dst) => {
    gulp.src(src)
        .pipe(sass({outputStyle: 'compact', precision: 10}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(csscomb())
        .pipe(gulp.dest(dst))
        .pipe(cleancss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dst));
};

const buildPug = (src, dst) => {
    gulp.src(src)
        .pipe(pug({pretty: true, doctype: 'html'}))
        .pipe(gulp.dest(dst));
};

gulp.task('watch', function () {
    gulp.watch('./**/*.scss', ['build']);
    gulp.watch('./**/*.scss', ['docs']);
    gulp.watch('./**/*.pug', ['docs']);
});

gulp.task('build', function () {
    buildStyle(p.sass.src, p.sass.dst);
});

gulp.task('docs', function () {
    buildStyle(p.docSass.src, p.docSass.dst);
    buildStyle(p.sass.src, p.docSass.dst);
    buildPug(p.docPug.src, p.docPug.dst);
});

gulp.task('default', ['build']);
