var gulp = require('gulp'),
	browserify = require('gulp-browserify'),
    gp_concat = require('gulp-concat'),
    gp_uglify = require('gulp-uglify'),
    gp_rename = require('gulp-rename'),
    gp_less = require('gulp-less'),
    fs = require('fs'),
    del = require('del');
	// deleting the build folder
	gulp.task('clean', function() {
	  // You can use multiple globbing patterns as you would with `gulp.src`
	  return del(['./public/build']);
	});

 	gulp.task('buildJS', function() {
		// Single entry point to browserify 
		gulp.src('./public/assets/js/main.js')		
			.pipe(browserify({
			  insertGlobals : true
			}))
			.pipe(gulp.dest('./public/build/js'))
			.on('finish',function(){
				gulp.src(['./public/assets/js/socket.io.min.js','./public/build/js/main.js'])
					.pipe(gp_concat('bundle.js'))
					.pipe(gulp.dest('./public/build/js'));	
			});

	}); 

	gulp.task('buildCSS', function () {
	   gulp.src('./public/assets/css/**/*.less')
	    .pipe(gp_less())
	    .pipe(gulp.dest('./public/build/css'));
	});

	gulp.task('build', gulp.parallel('buildJS','buildCSS'), function() {
	    
	});

	// Rerun the task when a file changes
	gulp.task('watch', function() {
	  gulp.watch(['./public/assets/js/**/*.js'], ['buildJS']);
	  gulp.watch(['./public/assets/css/**/*.less'], ['buildCSS']);
	});

	// The default task (called when you run `gulp` from cli)
	gulp.task('default', gulp.series('clean', 'build', 'watch'));
