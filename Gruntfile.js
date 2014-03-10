var config = {
    src: 'src',
    dist: 'dist'
};

module.exports = function(grunt) {

    // ========================================================================
    // Configure task options

    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('./package.json'),
        bower: grunt.file.readJSON('./.bowerrc'),
        clean: {
            css: [
                '<%= config.src %>/css/*.css',
                '<%= config.dist %>/css/*.css',
                'styleguide/css/*.css'
            ],
            js: '<%= config.dist %>/js'
        },
        lesslint: {
            src: ['<%= config.src %>/less/*.less']
        },
        less: {
            options: {
//                strictUnits: true
            },
            files: {
                expand: true,
                flatten: true,
                cwd: "<%= config.src %>",
                src: "less/*.less",
                dest: "<%= config.src %>/css",
                ext: ".css"
            }
        },
        cssmin: {
            options: {
//                report: 'gzip',
                banner: '/**!\n * @name\t\t<%= pkg.name %>\n * @version\t\tv<%= pkg.version %>\n * ' +
                    '@date\t\t<%= grunt.template.today("yyyy-mm-dd") %>\n * @copyright\t<%= pkg.copyright %>\n * @source\t\t<%= pkg.repository %>\n * @license\t\t<%= pkg.license %>\n */\n',
                footer: '/* @license-end */'
            },
            minify: {
                expand: true,
                cwd: '<%= config.src %>/css/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= config.dist %>/css/',
                ext: '.min.css'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    Modernizr: true,
                    console: true
                }
            },
            files: ['<%= config.src %>/js/lib/*.js', '<%= config.src %>/js/*.js']
        },
        concat: {
            options: {
                separator: '\n;',
                // Remove duplicate 'use strict' declarations
                banner: "'use strict';\n",
                process: function(src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            vendor: {
                files: {
                    '<%= config.dist %>/js/vendor.js': [
                        '<%= config.src %>/js/vendor/jquery-plugins/*.js',
                        '<%= config.src %>/js/vendor/xregexp/xregexp.js',
                        '<%= config.src %>/js/vendor/xregexp/xregexp-*.js',
                    ]
                }
            },
            lib: {
                files: {
                    // Note, the p3.lib file will only generate a library from files beginning with p3.
                    '<%= config.dist %>/js/p3.lib.js': '<%= config.src %>/js/lib/p3.*.js'
                }
            }
        },
        uglify: {
            options: {
                banner: '/**\n * @name\t\t<%= pkg.name %>\n * @version\t\tv<%= pkg.version %>\n * ' +
                    '@date\t\t<%= grunt.template.today("yyyy-mm-dd") %>\n * @copyright\t<%= pkg.copyright %>\n * @source\t\t<%= pkg.repository %>\n * @license <%= pkg.license %> */\n',
//                report: 'gzip',
                footer: '\n// @license-end',
                mangle: {
                    except: ['jQuery', 'Modernizr']
                }
            },
            jquery: {
                compress: false,
                options: {
                    banner: '/**\n * @source: http://code.jquery.com/jquery-1.10.2.min.js\n * @license <%= pkg.license %>\n * @note License is a rough approximation to suit EFF standards, see http://jquery.com/license for actual licensing information */\n'
                },
                files: {
                    '<%= config.dist %>/js/jquery.min.js': '<%= config.src %>/js/vendor/jquery.min.js'
                }
            },
            modernizr: {
                options: {
                    banner: '/**\n * @source: http://modernizr.com/download/\n * @license magnet:?xt=urn:btih:5305d91886084f776adcf57509a648432709a7c7&dn=x11.txt X11 %>\n * @note    License is a rough approximation to suit EFF standards, see http://jquery.com/license for actual licensing information */\n'
                },
                files: {
                    '<%= config.dist %>/js/modernizr.min.js': '<%= config.src %>/js/vendor/modernizr*.js'
                }
            },
            vendor: {
                files: {
                    '<%= config.dist %>/js/vendor.min.js': '<%= config.dist %>/js/vendor.js'
                }
            },
            compat: {
                compress: false,
                files: [{
                        expand: true,
                        cwd: '<%= config.src %>/js/compat',
                        src: '*.js',
                        dest: '<%= config.dist %>/js/compat'
                    }]
            },
            lib: {
                files: {
                    '<%= config.dist %>/js/p3.min.js': ['<%= config.dist %>/js/p3.lib.js'],
                    '<%= config.dist %>/js/site.js': ['<%= config.src %>/js/site-main.js'],
                    '<%= config.dist %>/js/action-template.js': ['<%= config.src %>/js/action-template-simple.js'],
                    '<%= config.dist %>/js/action-template-full.js': ['<%= config.src %>/js/action-template-full.js']
                }
            }
        },
        copy: {
            styleguide: {
                nonull: true,
                src: '<%= config.src %>/css/styleguide.css',
                dest: 'styleguide/css/styleguide.css'
            },
            bower: {
                files: {
                    '<%= config.src %>/js/vendor/jquery.min.js': '<%= bower.directory %>/jquery/jquery.min.js',
                    '<%= config.src %>/js/vendor/jquery-plugins/jquery.placeholder.js': "<%= bower.directory %>/jquery-placeholder/jquery.placeholder.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.timeago.js": "<%= bower.directory %>/jquery-timeago/jquery.timeago.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.validate.js": "<%= bower.directory %>/jquery-validation/jquery.validate.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.cookie.js": "<%= bower.directory %>/jquery.cookie/jquery.cookie.js",
                    "<%= config.src %>/js/vendor/compat/json.min.js": "<%= bower.directory %>/json3/lib/json3.min.js",
                    "<%= config.src %>/js/vendor/xregexp/xregexp.js": "<%= bower.directory %>/xregexp/src/xregexp.js",
                    "<%= config.src %>/js/vendor/xregexp/xregexp-unicode-base.js": "<%= bower.directory %>/xregexp/src/addons/unicode/unicode-base.js",
                    "<%= config.src %>/js/vendor/xregexp/xregexp-unicode-categories.js": "<%= bower.directory %>/xregexp/src/addons/unicode/unicode-categories.js"
                }
            }
        },
        watch: {
            js: {
                // Files to monitor for changes before running js task
                files: ['Gruntfile.js', 'package.json', '<%= config.src %>/**/*.js'],
                tasks: ['js'],
                options: {
                    spawn: false
                }
            },
            less: {
                // Files to monitor for changes before running css task
                files: ['Gruntfile.js', 'package.json', '<%= config.src %>/**/*.less'],
                tasks: ['css'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // on watch events configure jshint:all to only run on changed file
//    grunt.event.on('watch', function(action, filepath) {
//        grunt.config(['jshint', 'all'], filepath);
//    });

    // ========================================================================
    // Initialise

    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-lesslint');

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-copy');

    // ========================================================================
    // Register Tasks

    grunt.registerTask('bower', ['copy:bower']);

    // Run 'grunt test' to view jshint and lesslint recommendations
    grunt.registerTask('test', ['copy:bower', 'jshint', 'lesslint']);

    // Run 'grunt csslint' to check LESS quality, and if no errors then
    // compile LESS into CSS, combine and minify
    grunt.registerTask('csslint', ['lesslint', 'clean:css', 'less', 'cssmin']);

    // Run 'grunt css' to compile LESS into CSS, combine and minify
    grunt.registerTask('css', ['clean:css', 'less', 'cssmin', 'copy:styleguide']);

    // Run 'grunt js' to check JS code quality, and if no errors
    // concatonate and minify
    grunt.registerTask('js', ['copy:bower','jshint', 'clean:js', 'concat', 'uglify']);

    // 'grunt' will check code quality, and if no errors,
    // compile LESS to CSS, and minify and concatonate all JS and CSS
    grunt.registerTask('default', ['copy:bower', 'jshint', 'clean', 'less', 'copy:styleguide', 'cssmin', 'concat', 'uglify']);

};
