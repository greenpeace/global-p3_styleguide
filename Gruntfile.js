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
        cssmin: {
            options: {
//                report: 'gzip',
                banner: '/**!\n * @name <%= pkg.name %>\n * @version v<%= pkg.version %>\n * ' +
                    '@date <%= grunt.template.today("yyyy-mm-dd") %>\n * @copyright <%= pkg.copyright %>\n * @license <%= pkg.license %>\n */\n',
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
        }
    });

    // ========================================================================
    // Initialise

    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-lesslint');

    // ========================================================================
    // Register

    grunt.registerTask('test', ['jshint', 'lesslint']);

    grunt.registerTask('css', ['lesslint', 'clean:css', 'cssmin']);

    grunt.registerTask('js', ['jshint', 'clean:js', 'concat', 'uglify']);

    grunt.registerTask('default', ['jshint', 'clean', 'cssmin', 'concat', 'uglify']);

};