
module.exports = function(grunt) {


    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),

	concat: {
	    vendor: {
		files: {
		    'tmp/vendor.js': [
			//libraries
			'src/request.js'
		    ]
		}
	    },
	    js: {
		files: {
		    'tmp/app.js' : ['src/js/**/*.js']
		}
	    }
	},

	uglify: {
	    options: {
		beautify: {
		    ascii_only: true,
		    inline_script: true
		}
	    },
	    vendor: {
		files: {
		    'tmp/vendor.js': ['tmp/vendor.js']
		}
	    },
	    js: {
		files: {
		    'tmp/app.js': ['tmp/app.js']
		}
	    }
	},	

	stylus: {
	    options: {
		compress: true,
		'include css': true
	    },
	    compile: {
		files: {
		    'tmp/app.css': 'src/css/*.styl'
		}
	    }
	},
	cssmin: {
	    compress: {
		files: {
		    'tmp/app.css': 'tmp/app.css'
		}
	    }
	},
	staticinline: {
	    main: {
		files: {
		    'tmp/index.html': 'tmp/index.html'
		}
	    }
	},


	inline: {
	    index: {
		src: [ 'tmp/index.html' ]
	    }
	},
	

	jade: {
	    index: {
		files: [{
		    'tmp/index.html': ['src/views/index.jade']
		}]
	    }
	},

	htmlmin: {
	    index: {
		options: {
		    collapseWhitespace: true,
		    removeComments: true
		},
		files: {
		    'index.html': 'index.html'
		}
	    }
	},	

	copy: {
	    web: {
		files: [{
		    expand: true,
		    flatten: true,
		    src: 'tmp/index.html',
		    dest: './'
		}]
	    },
	    mobile: {
		files: [{
		    expand: true,
		    flatten: true,
		    src: 'tmp/index.html',
		    dest: 'www/'
		}]
	    }
	},

	watch: {
	    index: {
		files: ['src/views/**/*.jade', 'src/**/*.js', 'bower_components/**/*', 'src/css/**/*'],
		tasks: ['default']
	    }
	}
    });

    grunt.registerTask('base', [
	//'clean',
	'stylus',
	'cssmin',
	'concat:vendor',
	'concat:js'
    ]);

    grunt.registerTask('after', [
	'uglify',
	'staticinline',
	'inline',
	'copy',	
	'htmlmin'
    ]);

    grunt.registerTask('default', [
	'base',
	
	'jade:index',

	'after'
    ]);

    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-static-inline');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');    

};
