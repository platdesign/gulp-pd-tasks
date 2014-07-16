var
		gulp		= require('gulp')
	,	gutil		= require('gulp-util')
	,	path		= require('path')
	,	jsInclude 	= require('gulp-js-include')
	,	watch		= require('gulp-watch')
	,	jshint 		= require('gulp-jshint')
	,	stylish 	= require('jshint-stylish')
	, 	ignore 		= require('gulp-ignore')
	, 	uglify 		= require('gulp-uglify')
	, 	rename 		= require('gulp-rename')
	, 	changed 	= require('gulp-changed')
	,	plumber 	= require('gulp-plumber')

	,	sass 		= require('gulp-ruby-sass')
	,	livereload 	= require('gulp-livereload')
	,	cssprefix 	= require('gulp-autoprefixer')
	,	clean		= require('gulp-clean')

	,	jade		= require('gulp-jade')

	,	imagemin 	= require('gulp-imagemin')

	,	runSequence = require('gulp-run-sequence')
;



var tasks = module.exports = {};

tasks.jsDev = function(o) {
	o = o || {};

	var src = path.join( o.src, '**/*.js' );
	var dest = o.dest;

	return function(cb) {

		return gulp.src( src )

			.pipe( watch({glob:src}, function(files){

				files
					.pipe( jshint() )
					.pipe( jshint.reporter(stylish) );

				return gulp.src( src )

					.pipe( ignore.exclude('**/_*.js') )

					.pipe( jsInclude() )

				.pipe( gulp.dest( dest ));

			}) )

	}
};

tasks.jsBuild = function(o) {
	o = o || {};

	var src = path.join( o.src, '**/*.js' );
	var dest = o.dest;

	return function(cb) {

		return gulp.src( src )
				.pipe( ignore.exclude('**/_*.js') )
				.pipe( jsInclude() )
				.pipe( jshint() )
				.pipe( jshint.reporter(stylish) )
				.pipe( uglify() )
				.pipe( rename({suffix:o.suffix||''}))
			.pipe( gulp.dest( dest ));
		;
	}
};





tasks.scssDev = function(o) {
	o = o || {};

	var src = path.join( o.src, '**/*.scss' );
	var dest = o.dest;


	return function(cb) {
		return gulp.src( src )
			.pipe( watch({ glob:src }, function(){

				gulp.src( src )
				.pipe( plumber() )
				.pipe( sass( {
					precision:10
				} ) )
				.pipe( cssprefix('last 5 version', '> 1%', "ie 8", "ie 7") )
				.pipe( gulp.dest( dest ) )
				.pipe( livereload() );

			}) )

		;
	};
};


tasks.scssBuild = function(o) {
	o = o || {};

	var src = path.join( o.src, '**/*.scss' );
	var dest = o.dest;


	return function(cb) {
		return gulp.src( src )
			.pipe( plumber() )
			.pipe( sass( {
				precision:10,
				style:'compressed'
			} ) )
			.pipe( cssprefix('last 5 version', '> 1%', "ie 8", "ie 7") )
			.pipe( rename({suffix:o.suffix||''}))
			.pipe( gulp.dest( dest ) )
		;
	};
};





tasks.jadeDev = function(o) {
	o = o || {};

	var src = path.join( o.src, '**/*.jade' );
	var dest = o.dest;

	return function(cb) {
		return gulp.src( src )
			.pipe( watch({ glob:src }) )
			.pipe( ignore.exclude('**/_*.jade') )
			.pipe( jade({
				pretty: true
			}) )
			.pipe( gulp.dest( dest ) );
		;
	};
};

tasks.jadeBuild = function(o) {
	o = o || {};

	var src = path.join( o.src, '**/*.jade' );
	var dest = o.dest;

	return function(cb) {
		return gulp.src( src )
			.pipe( ignore.exclude('**/_*.jade') )
			.pipe( jade() )
			.pipe( rename({suffix:o.suffix||''}))
			.pipe( gulp.dest( dest ) );
		;
	};
};



tasks.gfxDev = function(o) {
	o = o || {};

	var src = [
		path.join( o.src, '**/*.png' ),
		path.join( o.src, '**/*.jpg' ),
		path.join( o.src, '**/*.gif' ),
		path.join( o.src, '**/*.jpeg' ),
		path.join( o.src, '**/*.svg' )
	];
	var dest = o.dest;

	return function(cb) {
		return gulp.src( src )
			.pipe( watch({glob:src}))
		    .pipe( gulp.dest( dest ) );
	};
};


tasks.gfxBuild = function(o) {
	o = o || {};

	var src = [
		path.join( o.src, '**/*.png' ),
		path.join( o.src, '**/*.jpg' ),
		path.join( o.src, '**/*.gif' ),
		path.join( o.src, '**/*.jpeg' ),
		path.join( o.src, '**/*.svg' )
	];
	var dest = o.dest;

	return function(cb) {
		return gulp.src( src )
			.pipe( imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				optimizationLevel: 5,
				interlaced: true
		    }) )
		    .pipe( gulp.dest( dest ) );
	};
};



tasks.clean = function(o) {
	o = o || {};

	var src = o.src;

	return function() {
		return gulp.src( src )
			.pipe( clean() );
	};
};



tasks.devTasks = [];
tasks.buildTasks = [];

tasks.addAssetDir = function(path) {

	//	JS-DEV
	gulp.task( name + '-js-dev', tasks.jsDev({
		src: 	path 	+ '/js-src',
		dest: 	path 	+ '/js'
	}));

	tasks.devTasks.push( name + '-js-dev' );


	//	JS-BUILD
	gulp.task( name + '-js-build', tasks.jsBuild({
		src: 	path 	+ '/js-src',
		dest: 	path 	+ '/js'
	}));

	tasks.buildTasks.push( name + '-js-build' );







	//	SCSS-DEV
	gulp.task( name + '-scss-dev', tasks.scssDev({
		src: 	path 	+ '/scss',
		dest: 	path 	+ '/css'
	}));

	tasks.devTasks.push( name + '-scss-dev' );


	//	SCSS-BUILD
	gulp.task( name + '-scss-build', tasks.scssBuild({
		src: 	path 	+ '/scss',
		dest: 	path 	+ '/css'
	}));

	tasks.buildTasks.push( name + '-scss-build' );








	//	JADE-DEV
	gulp.task( name + '-jade-dev', tasks.jadeDev({
		src: 	path 	+ '/jade',
		dest: 	path 	+ '/html'
	}));

	tasks.devTasks.push( name + '-jade-dev' );



	//	JADE-BUILD
	gulp.task( name + '-jade-build', tasks.jadeBuild({
		src: 	path 	+ '/jade',
		dest: 	path 	+ '/html'
	}));

	tasks.buildTasks.push( name + '-jade-build' );









	//	GFX-DEV
	gulp.task( name + '-gfx-dev', tasks.gfxDev({
		src: 	path 	+ '/gfx-src',
		dest: 	path 	+ '/gfx'
	}));

	tasks.devTasks.push( name + '-gfx-dev' );




	//	GFX-BUILD
	gulp.task( name + '-gfx-build', tasks.gfxBuild({
		src: 	path 	+ '/gfx-src',
		dest: 	path 	+ '/gfx'
	}));

	tasks.buildTasks.push( name + '-gfx-build' );

}




