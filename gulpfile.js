var gulp             = require('gulp'),
    uglify           = require('gulp-uglify'),
    source           = require('vinyl-source-stream'),
    browserify       = require('browserify'),
    reactify         = require('reactify'),
    streamify        = require('gulp-streamify'),
    less             = require('gulp-less'),
    CleanCssPlugin   = require('less-plugin-clean-css'),
    AutoprefixPlugin = require('less-plugin-autoprefix'),
    cleancss         = new CleanCssPlugin({ advanced: true }),
    autoprefix       = new AutoprefixPlugin({ browsers: ['last 2 versions'] }),
    rename           = require('gulp-rename'),
    watch            = require('gulp-watch'),
    path             = {};

path.LESS        = './src/**/*.less';
path.LESS_ENTRY  = './src/components/common/index.less';
path.JS          = './src/**/*.js';
path.JS_ENTRY    = './src/app.js';
path.DIST        = './extension/dist';
path.OUT_CSS     = 'bundle.css';
path.OUT_JS      = 'bundle.js';
path.OUT_CSS_MIN = 'bundle.min.css';
path.OUT_JS_MIN  = 'bundle.min.js';

// LESS
gulp.task('less', function () {
  var stream = gulp.src(path.LESS_ENTRY)
    .pipe(less({
      plugins: [autoprefix, cleancss]
    }))
    .pipe(rename(path.OUT_CSS_MIN))
    .pipe(gulp.dest(path.DIST));
  
  stream.on('end', function () {
    console.log('----CSS UPDATED----');
  });
});

// Watch changes to JS
gulp.task('js', function() {
  var stream = browserify(path.JS_ENTRY)
    .transform(reactify)
    .bundle()
    .pipe(source(path.OUT_JS))
    .pipe(gulp.dest(path.DIST))
    .pipe(rename(path.OUT_JS_MIN))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(path.DIST));
    
  stream.on('end', function () {
    console.log('----JS UPDATED----');
  });
});

// Watch CSS
gulp.task('watchLess', function () {
  gulp.watch(path.LESS, ['less']);
});

// Watch JS
gulp.task('watchJs', function () {
  gulp.watch(path.JS, ['js']);
});

gulp.task('default', ['less', 'js', 'watchLess', 'watchJs']);