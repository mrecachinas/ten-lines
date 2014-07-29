var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload');

gulp.task('styles', function () {
	return gulp.src('static/css/sass/main.scss')
		.pipe(sass({ style: 'expanded' }))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('static/css/'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('static/css'))
		.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function () {
	return gulp.src('static/js/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('static/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('static/js'))
		.pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('clean', function () {
	return gulp.src(['static/css/sass', 'static/js'], {read: false})
    	.pipe(clean());
});

gulp.task('default', ['clean'], function() {
	gulp.start('styles', 'scripts');
});

gulp.task('watch', function () {
	gulp.watch('static/css/**/**/*.scss', ['styles']);
	gulp.watch('static/js/*.js', ['scripts']);

	var server = livereload();
	gulp.watch(['static/**']).on('change', function (file) {
		server.changed(file.path);
	});
});

