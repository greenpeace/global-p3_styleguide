module.exports = function(grunt) {

    // ========================================================================
    // Configure task options

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            css: 'dist/css',
            js: 'dist/js'
        },
        lesslint: {
            src: ['src/less/*.less']
        },
        less: {
            options: {
//                strictUnits: true
            },
            src: {
                // no need for files, the config below should work
                expand: true,
                flatten: true,
                cwd: "src",
                src: "**/*.less",
                dest: "src/css",
                ext: ".css"
            }
        },
        cssmin: {
            options: {
//                report: 'gzip',
                banner: '/**!\n * @name <%= pkg.name %>\n * @version v<%= pkg.version %>\n * ' +
                    '@date <%= grunt.template.today("yyyy-mm-dd") %>\n * @copyright <%= pkg.copyright %>\n * @license <%= pkg.license %>\n */\n'
            },
            combine: {
                files: {
                    'dist/css/style.css': 'src/css/*.css'
                }
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
            files: ['src/js/lib/*.js', 'src/js/action-template-main.js']
        },
        concat: {
            options: {
                separator: '\n',
                // Remove duplicate 'use strict' declarations
                banner: "'use strict';\n",
                process: function(src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            vendor: {
                files: {
                    'dist/js/vendor.js': ['src/js/vendor/jquery.*.js', 'src/js/vendor/xregexp*.js']
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
                banner: '/**!\n * @name <%= pkg.name %>\n * @version v<%= pkg.version %>\n * ' +
                    '@date <%= grunt.template.today("yyyy-mm-dd") %>\n * @copyright <%= pkg.copyright %>\n * @license <%= pkg.license %>\n */\n',
//                report: 'gzip',
                mangle: {
                    except: ['jQuery', 'Modernizr']
                }
            },
            modernizr: {
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
                    'dist/js/p3.min.js': ['dist/js/p3.lib.js', 'src/js/action-template-main.js']
                }
            }
        },
        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['js'],
                options: {
                        spawn: false
                }
            },
            less: {
                files: ['src/**/*.less'],
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
    grunt.registerTask('csslint', ['lesslint', 'less', 'clean:css', 'cssmin']);

    // Run 'grunt css' to compile LESS into CSS, combine and minify
    grunt.registerTask('css', ['less', 'clean:css', 'cssmin']);

    // Run 'grunt js' to check JS code quality, and if no errors
    // concatonate and minify
    grunt.registerTask('js', ['jshint', 'clean:js', 'concat', 'uglify']);

    // 'grunt' will check code quality, and if no errors,
    // compile LESS to CSS, and minify and concatonate all JS and CSS
    grunt.registerTask('default', ['jshint', 'clean', 'less', 'cssmin', 'concat', 'uglify']);

};