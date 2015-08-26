// Generated on 2015-03-07 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  var modRewrite = require('connect-modrewrite');

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({


    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Listen on all interfaces rather than only in localhost
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              modRewrite(['^[^\\.]*$ /index.html [L]']),
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      development_artwork: {
        files: [
          {
            src: [
              '<%= yeoman.app %>/favicon.ico',
              '<%= yeoman.app %>/images/logo.png'
            ]
          }
        ]
      },
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
          block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/styles'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{

          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      site_artwork: { //will copy site specifict artwork
        files: [
          {
            expand: true,
            cwd: './sites/<%= prompt.which_site.site %>',
            dest: '<%= yeoman.app %>/images',
            src: 'logo.png'
          },
          {
            expand: true,
            cwd: './sites/<%= prompt.which_site.site %>',
            dest: '<%= yeoman.app %>',
            src: 'favicon.ico'
          },
      ]}
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles',
        'copy:site_artwork'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    // Bit Balloon Configuration
    bb: {
      token: 'NONE. TO BE PROVIDED TROUGHT INPUT',
      sitename:  'NONE. TO BE PROVIDED TROUGHT INPUT'
    },
    bitballoon: {
      options: {
        token: '<%= bb.token %>',
        src: 'dist'
      },
      staging: {
        site: 'http://eco-roof-and-solar.bitballoon.com/'
      },
      endeavor: {
        site: 'http://endeavor-exteriors.bitballoon.com/'
      },
      ecoroof: {
        site: 'http://www.ecocp.ecoroofandsolar.com/'
      },
      monarch: {
        site: 'http://monarch-roofing.bitballoon.com/'
      },
      greenrhino: {
        site: 'http://green-rhino.bitballoon.com/'
      },
      highimpact: {
        site: 'http://high-impact.bitballoon.com/'
      },
      skyline: {
        site: 'http://sky-line.bitballoon.com/'
      },
      startclosing: {
        site: 'http://startclosing.bitballoon.com/'
      },
      summitpoint: {
        site: 'http://summit-point.bitballoon.com/'
      }
    },
    
    prompt: {
      bbtoken:{
        options:{
          questions:[
            {
              config: 'bb.token',
              type: 'password',
              message: 'Please provide your Bitballoon token'
            }
          ]
        }
      },
      which_site:{
        options:{
          site: 'staging',
          questions:[
            {
              config: 'prompt.which_site.site',
              type: 'list',
              message: 'Which site?',
              default: 'staging',
              choices: [
                'staging',
                'ecoroof',
                'endeavor',
                'monarch',
                'greenrhino',
                'highimpact',
                'skyline',
                'startclosing',
                'summitpoint'
                ]
            }
          ]
        }
      }
    },

    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'config',
      },
      // Environment targets
      staging: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'staging',
            apiEndpoint: 'http://54.68.73.69'
          }
        }
      },
      ecoroof: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'ecoroof',
            apiEndpoint: 'https://eco-roof.herokuapp.com'
          }
        }
      },
      endeavor: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'endeavor',
            apiEndpoint: 'https://endeavor-exteriors.herokuapp.com'
          }
        }
      },
      monarch: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'monarch',
            apiEndpoint: 'http://monarch-roofing.herokuapp.com'
          }
        }
      },
      greenrhino: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'greenrhino',
            apiEndpoint: 'http://green-rhino.herokuapp.com'
          }
        }
      },
      highimpact: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'highimpact',
            apiEndpoint: 'http://high-impact.herokuapp.com'
          }
        }
      },
      skyline: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'skyline',
            apiEndpoint: 'http://sky-line.herokuapp.com'
          }
        }
      },
      startclosing: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'startclosing',
            apiEndpoint: 'http://startclosing.herokuapp.com'
          }
        }
      },
      summitpoint: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'summitpoint',
            apiEndpoint: 'http://summit-point.herokuapp.com'
          }
        }
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build_dev', 'connect:dist:keepalive']);
    }
    grunt.config('prompt.which_site.site','staging');

    grunt.task.run([
      'clean:server',
      'copy:site_artwork',
      'ngconstant:staging',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('build_and_deploy', 'Build and deploy site into Bitballoon bucket', function (){
    grunt.task.run(['build','prompt:bbtoken', 'deploy_site']);
  });

  grunt.registerTask('deploy', 'Deploy dist dir into Bitballoon bucket', function (site){
    grunt.task.run(['prompt:which_site','prompt:bbtoken', 'deploy_site']);
  });

  grunt.registerTask('deploy_site', 'Deploy dist dir into Bitballoon bucket for a site', function (){
    var site_name= grunt.config('prompt.which_site.site');
    grunt.log.debug('The dist folder will be deployed into Bitballoon site [' + site_name + ']');
    grunt.task.run([ 'bitballoon:' + site_name ]);
  });

  grunt.registerTask('heroku',
    ['compass:dist', 'autoprefixer', 'imagemin']);

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('common_build_steps', [
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('build',
    [
      'prompt:which_site',
      'build_site'

    ]
  );

  grunt.registerTask('build_site','About to build into dist folder', function(){
    var site_name= grunt.config('prompt.which_site.site');
    grunt.log.debug('The [' + site_name + '] will be built into dist folder.');
    grunt.task.run(
      [
        'clean:dist',
        'ngconstant:' + site_name,
        'clean:development_artwork',
        'copy:site_artwork',
        //'copy:'  +  site_name + '_artwork',
        'common_build_steps'
      ]);
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.loadNpmTasks('grunt-bitballoon'); //grunt bitballoon:dev
  grunt.loadNpmTasks('grunt-prompt');
};

