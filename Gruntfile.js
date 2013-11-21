module.exports = function(grunt) {

    // ========================================================================
    // Configure task options

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            css: 'dist/css',
            js: 'dist/js'
        },
        cssmin: {
            options: {
                report: 'gzip'
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
                separator: ';',
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
                    '@date <%= grunt.template.today("yyyy-mm-dd") %>\n * @copyright 2013 Greenpeace International\n * @license MIT License\n */\n',
                report: 'gzip',
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
            lib: {
                files: {
                    'dist/js/p3.min.js': ['dist/js/p3.lib.js', 'src/js/action-template-main.js']
                }
            }
        }
    });

    // ========================================================================
    // Initialise

    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-clean');

    // ========================================================================
    // Register

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('css', ['clean:css', 'cssmin']);

    grunt.registerTask('js', ['clean:js', 'jshint', 'concat', 'uglify']);

    grunt.registerTask('default', ['clean', 'cssmin', 'concat', 'uglify']);

};