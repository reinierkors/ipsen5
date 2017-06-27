var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
// import moduleImporter from 'sass-module-importer';
var moduleImporter = require('sass-module-importer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var input = './src/assets/sass/**/*.scss';
var output = './src/assets/css';

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    importer: moduleImporter()
};

gulp.task('js', function() {
    gulp.src('./src/assets/scripts/*.js')
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./src/assets/scripts/'))
});

gulp.task('copy', function() {
    gulp.src('./src/assets/sass/fonts/*.{ttf,woff,eof,eot,svg}')
        .pipe(gulp.dest('./src/assets/css/fonts'))
});

gulp.task('sass', function () {
    return gulp
        // Find all `.scss` files from the `stylesheets/` folder
        .src(input)
        // Run Sass on those files
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        // Write the resulting CSS in the output folder
        .pipe(gulp.dest(output));
});

gulp.task('watch', function() {
    return gulp
    // Watch the input folder for change,
    // and run `sass` task when something happens
        .watch(input, ['sass'])
        // When there is a change,
        // log a message in the console
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});

gulp.task('watch', function() {
    gulp.watch('./src/assets/scripts/*.js', ['js']);
    gulp.watch(input, ['sass']);
});

gulp.task('default', ['sass', 'watch', 'js', 'copy' /*, possible other tasks... */]);

gulp.task('prod', function () {
    return gulp
        .src(input)
        .pipe(sass({ outputStyle: 'compressed', importer: moduleImporter() }))
        .pipe(autoprefixer())
        .pipe(gulp.dest(output));
});