//
//  Required Plugins
var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    cssnano      = require('gulp-cssnano'),
    childProcess = require('child_process'),
    plumber      = require('gulp-plumber'),
    sass         = require('gulp-sass');

var messages     = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

//
//  Jekyll Build
gulp.task('jekyll-build', function(done) {
    browserSync.notify(messages.jekyllBuild);
    return childProcess.spawn('jekyll.bat', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

//
//  Jekyll Rebuild
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});

//
//  Jekyll Serve
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync.init({
        server: '_site',
        notify: true
    });
});

//
//  SASS Compile
gulp.task('sass', function() {
    gulp.src('app/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers:  ['last 2 versions'],
            cascade:   false
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('app/_includes'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//
//  Watch
gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch(['app/*.html', 'app/js/*.js', 'app/_layouts/*.html', 'app/_posts/*', 'app/_includes/*.html', 'app/_includes/*.css'], ['jekyll-rebuild']);
});

//
//  Default
gulp.task('default', ['browser-sync', 'watch']);
