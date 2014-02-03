module.exports = function(grunt) {

    // ========================================================================
    // Configure task options

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            css: ['src/css/*.css', 'dist/css/*.css'],
            js: 'dist/js'
        },
        lesslint: {
            src: ['src/less/*.less']
        },
        less: {
            options: {
//                strictUnits: true
            },
            files: {
                expand: true,
                flatten: true,
                cwd: "src",
                src: "less/*.less",
                dest: "src/css",
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
            /*combine: {
             files: {
             'dist/css/style.css': 'src/css/*.css'
             }
             }*/
            minify: {
                expand: true,
                cwd: 'src/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'dist/css/',
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
            files: ['src/js/lib/*.js', 'src/js/*.js']
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
                    'dist/js/vendor.js': ['src/js/vendor/jquery.*.js', 'src/js/vendor/xregexp.js', 'src/js/vendor/xregexp-unicode.min.js', 'src/js/vendor/jquery.fs.picker.js']
                }
            },
            lib: {
                files: {
                    'dist/js/p3.lib.js': 'src/js/lib/p3.*.js'
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
                    'dist/js/jquery.min.js': 'src/js/vendor/jquery-1.10.2.min.js'
                }
            },
            modernizr: {
                options: {
                    banner: '/**\n * @source: http://modernizr.com/download/\n * @license magnet:?xt=urn:btih:5305d91886084f776adcf57509a648432709a7c7&dn=x11.txt X11 %>\n * @note    License is a rough approximation to suit EFF standards, see http://jquery.com/license for actual licensing information */\n'
                },
                files: {
                    'dist/js/modernizr.min.js': 'src/js/vendor/modernizr*.js'
                }
            },
            vendor: {
                files: {
                    'dist/js/vendor.min.js': 'dist/js/vendor.js'
                }
            },
            compat: {
                files: [{
                        expand: true,
                        cwd: 'src/js/compat',
                        src: '*.js',
                        dest: 'dist/js/compat'
                    }]
            },
            lib: {
                files: {
                    'dist/js/p3.min.js': ['dist/js/p3.lib.js'],
                    'dist/js/site.js': ['src/js/site-main.js'],
                    'dist/js/action-template.js': ['src/js/action-template-simple.js'],
                    'dist/js/action-template-full.js': ['src/js/action-template-full.js']
                }
            }
        },
        watch: {
            js: {
                files: ['Gruntfile.js', 'package.json', 'src/**/*.js'],
                tasks: ['js'],
                options: {
                    spawn: false
                }
            },
            less: {
                files: ['Gruntfile.js', 'package.json', 'src/**/*.less'],
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

    // ========================================================================
    // Register Tasks

    // Run 'grunt test' to view jshint and lesslint recommendations
    grunt.registerTask('test', ['jshint', 'lesslint']);

    // Run 'grunt csslint' to check LESS quality, and if no errors then
    // compile LESS into CSS, combine and minify
    grunt.registerTask('csslint', ['lesslint', 'clean:css', 'less', 'cssmin']);

    // Run 'grunt css' to compile LESS into CSS, combine and minify
    grunt.registerTask('css', ['clean:css', 'less', 'cssmin']);

    // Run 'grunt js' to check JS code quality, and if no errors
    // concatonate and minify
    grunt.registerTask('js', ['jshint', 'clean:js', 'concat', 'uglify']);

    // 'grunt' will check code quality, and if no errors,
    // compile LESS to CSS, and minify and concatonate all JS and CSS
    grunt.registerTask('default', ['jshint', 'clean', 'less', 'cssmin', 'concat', 'uglify']);

};
