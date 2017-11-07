var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var htmlmin = require('gulp-htmlmin');

gulp.task('start', function(done) {
	nodemon({
		script: 'server.js',
		watch: 'app',
		ext: 'js html',
		env: {
			'NODE_ENV': 'development'
		}
	});
});

gulp.task('default', ['minify1', 'minify2', 'start']);
gulp.task('build', ['minify1', 'minify2']);

gulp.task('minify1', function() {
  return gulp.src('public/orgviews/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public'))
});

gulp.task('minify2', function() {
  return gulp.src('public/orgviews/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public/views'))
});