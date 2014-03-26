module.exports = function(grunt) {
    'use strict';

    var config = {
        src: 'src',
        dist: 'dist',
        test: 'test',
        tmp: 'tmp',
        styleguide: 'styleguide'
    };

    // ========================================================================
    // Configure task options

    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('./package.json'),
        bower: grunt.file.readJSON('./.bowerrc'),
        clean: {
            html: '<%= config.dist %>/*.html',
            images: '<%= config.dist %>/img',
            css: [
                '<%= config.src %>/css/*.css',
                '<%= config.dist %>/css/*.css',
                '<%= config.styleguide %>/css/*.css'
            ],
            js: '<%= config.dist %>/js',
            test: [
                '<%= config.test %>/js',
                '<%= config.test %>/css',
                '<%= config.test %>/img'
            ]
        },
        htmllint: {// https://github.com/jzaefferer/grunt-html
            options: {
                ignore: [
                    'Bad value “X-UA-Compatible” for attribute “http-equiv” on XHTML element “meta”.'
                ]
            },
            src: ["<%= config.src %>/**/*.html"],
            processed: [
                "<%= config.dist %>/**/*.html",
                "<%= config.test %>/**/*.html"
            ],
            styleguide: ["<%= config.styleguide %>/**/*.html"]
        },
        prettify: {// https://github.com/jonschlinkert/grunt-prettify
            options: {
                indent: 4,
                condense: true,
                indent_inner_html: true,
                unformatted: [
                    "a",
                    "pre",
                    "textarea",
                    "code"
                ]
            },
            src: {
                files: [
                    {// Prettify src HTML, store it in /tmp
                        expand: true,
                        cwd: '<%= config.src %>',
                        src: ['*.html'],
                        dest: '<%= config.tmp %>/'
                    }
                ]
            }
        },
        htmlmin: {// https://github.com/gruntjs/grunt-contrib-htmlmin
            test: {
                options: {// Do nothing for test
                },
                files: [
                    {// Copy all HTML from tmp to testing
                        expand: true,
                        cwd: '<%= config.tmp %>',
                        src: ['*.html'],
                        dest: '<%= config.test %>/'
                    }
                ]
            },
            dist: {
                options: {
//                    removeComments: true,
//                    collapseWhitespace: true
                },
                files: [
                    {// Copy production HTML from tmp to dist, except for testing
                        expand: true,
                        cwd: '<%= config.tmp %>',
                        src: ['*.html', '!testing*.html'],
                        dest: '<%= config.dist %>/'
                    }
                ]
            }

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
        jshint: {// https://www.npmjs.org/package/grunt-contrib-jshint
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
        jsonlint: {
            countries: {
                src: ['<%= config.src %>/countries/*.json']
            }
        },
        concat: {// https://www.npmjs.org/package/grunt-contrib-concat
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
                        '<%= config.src %>/js/vendor/xregexp/xregexp-*.js'
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
        uglify: {// https://www.npmjs.org/package/grunt-contrib-uglify
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
                    banner: '/**\n * @source: http://code.jquery.com/ */\n',
                    footer: ''
                },
                files: {
                    '<%= config.dist %>/js/jquery.min.js': '<%= config.src %>/js/vendor/jquery.min.js'
                }
            },
            modernizr: {
                options: {
                    banner: '/**\n * @source: http://modernizr.com/download/ */\n',
                    footer: ''
                },
                files: {
                    '<%= config.dist %>/js/modernizr-custom.min.js': '<%= config.src %>/js/vendor/modernizr-custom.js'
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
                    '<%= config.dist %>/js/action-template-full.js': ['<%= config.src %>/js/action-template-full.js'],
                    '<%= config.dist %>/js/action-template-ocean.js': ['<%= config.src %>/js/action-template-ocean.js']
                }
            }
        },
        copy: {// https://www.npmjs.org/package/grunt-contrib-copy
            styleguide: {
                nonull: true,
                src: '<%= config.src %>/css/styleguide.css',
                dest: '<%= config.styleguide %>/css/styleguide.css'
            },
            bower: {
                files: {
                    "<%= config.src %>/js/vendor/jquery.min.js": "<%= bower.directory %>/jquery/dist/jquery.min.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.placeholder.js": "<%= bower.directory %>/jquery-placeholder/jquery.placeholder.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.timeago.js": "<%= bower.directory %>/jquery-timeago/jquery.timeago.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.validate.js": "<%= bower.directory %>/jquery-validation/jquery.validate.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.cookie.js": "<%= bower.directory %>/jquery.cookie/jquery.cookie.js",
                    "<%= config.src %>/js/vendor/compat/json.min.js": "<%= bower.directory %>/json3/lib/json3.min.js",
                    "<%= config.src %>/js/vendor/xregexp/xregexp.js": "<%= bower.directory %>/xregexp/src/xregexp.js",
                    "<%= config.src %>/js/vendor/xregexp/xregexp-unicode-base.js": "<%= bower.directory %>/xregexp/src/addons/unicode/unicode-base.js",
                    "<%= config.src %>/js/vendor/xregexp/xregexp-unicode-categories.js": "<%= bower.directory %>/xregexp/src/addons/unicode/unicode-categories.js"
                }
            },
            fonts: {
                files: [
                    {// Copy src images to dist
                        expand: true,
                        cwd: '<%= config.src %>/fonts/',
                        src: ['*'],
                        dest: '<%= config.dist %>/fonts/'
                    },
                    {// Copy src images to test
                        expand: true,
                        cwd: '<%= config.src %>/fonts/',
                        src: ['*'],
                        dest: '<%= config.test %>/fonts/'
                    }
                ]
            },
            images: {
                files: [
                    {// Copy src images to dist
                        expand: true,
                        cwd: '<%= config.src %>/img/',
                        src: ['*'],
                        dest: '<%= config.dist %>/img/'
                    },
                    {// Copy src images to test
                        expand: true,
                        cwd: '<%= config.src %>/img/',
                        src: ['*'],
                        dest: '<%= config.test %>/img/'
                    }
                ]
            },
            json: {
                files: [
                    {// Copy src countries json to dist
                        expand: true,
                        cwd: '<%= config.src %>/countries/',
                        src: ['*'],
                        dest: '<%= config.dist %>/countries/'
                    },
                    {// Copy src countries json to test
                        expand: true,
                        cwd: '<%= config.src %>/countries/',
                        src: ['*'],
                        dest: '<%= config.test %>/countries/'
                    }
                ]
            },
            testDist: {
                files: [
                    {// Copy the contents of /dist/ to /test/
                        // ** except HTML we do that in `htmlmin`
                        expand: true,
                        cwd: '<%= config.dist %>',
                        src: ['**', '!**/*.html'],
                        dest: '<%= config.test %>/'
                    },
                    {

                    }
                ]
            },
            testCSS: {
                files: [
                    {// Copy unminified CSS to /test/ for debugging
                        expand: true,
                        cwd: '<%= config.src %>/css',
                        src: ['*.css'],
                        dest: '<%= config.test %>/css/'
                    }
                ]
            },
            testJS: {
                files: {
                    '<%= config.test %>/js/site.js': ['<%= config.src %>/js/site-main.js'],
                    '<%= config.test %>/js/p3.lib.js': ['<%= config.dist %>/js/p3.lib.js'],
                    '<%= config.test %>/js/modernizr-custom.js': ['<%= config.src %>/js/vendor/modernizr-custom.js'],
                    '<%= config.test %>/js/action-template.js': ['<%= config.src %>/js/action-template-simple.js'],
                    '<%= config.test %>/js/action-template-full.js': ['<%= config.src %>/js/action-template-full.js'],
                    '<%= config.test %>/js/action-template-testing.js': ['<%= config.src %>/js/action-template-testing.js']
                }
            }
        },
        replace: {// https://www.npmjs.org/package/grunt-text-replace
            dist: {
                src: ['<%= config.dist %>/*.html'],
                dest: ['<%= config.dist %>/'],
                replacements: [
                    { //
                        from: 'vendor/modernizr-custom.js', // string replacement
                        to: 'modernizr-custom.min.js'
                    }
                ]
            },
            test: {
                src: ['<%= config.test %>/*.html'], // source files array (supports minimatch)
                dest: '<%= config.test %>/', // destination directory or file
                replacements: [
                    {
                        from: 'vendor/modernizr',
                        to: 'modernizr'
                    },
                    {
                        from: 'p3.min.js', // string replacement
                        to: 'p3.lib.js'
                    }, {
                        from: 'vendor.min.js', // string replacement
                        to: 'vendor.js'
                    },
                    {
                        from: '.min.css', // regex replacement ('Fooo' to 'Mooo')
                        to: '.css'
                    }
                ]
            }
        },
        modernizr: {
            src: {
                // [REQUIRED] Path to the build you're using for development.
                devFile: "src/js/vendor/modernizr-custom.js",
                // [REQUIRED] Path to save out the built file.
                outputFile: "src/js/vendor/modernizr-custom.js",
                // Based on default settings on http://modernizr.com/download/
                extra: {
                    shiv: true,
                    printshiv: false,
                    load: true,
                    mq: true,
                    cssclasses: true
                },
                // Based on default settings on http://modernizr.com/download/
                extensibility: {
                    addtest: false,
                    prefixed: true,
                    teststyles: false,
                    testprops: false,
                    testallprops: false,
                    hasevents: false,
                    prefixes: false,
                    domprefixes: false
                },
                // By default, source is uglified before saving
                uglify: false,
                // Define any tests you want to implicitly include.
                tests: [],
                // By default, this task will crawl your project for references to Modernizr tests.
                // Set to false to disable.
                parseFiles: true,
                // When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
                // You can override this by defining a files array below.
                files: {
                    src: [
                        '<%= config.src %>/**/*.css',
                        '<%= config.src %>/**/*.js'
                    ]
                },
                // When parseFiles = true, matchCommunityTests = true will attempt to
                // match user-contributed tests.
                matchCommunityTests: false,
                // Have custom Modernizr tests? Add paths to their location here.
                customTests: []
            }

        },
        watch: {
            images: {
                files: '<%= config.src %>/img/**',
                tasks: ['images'],
                options: {
                    spawn: false,
                    debounceDelay: 250
                }
            },
            fonts: {
                files: '<%= config.src %>/fonts/**',
                tasks: ['fonts'],
                options: {
                    spawn: false,
                    debounceDelay: 250
                }
            },
            html: {
                files: '<%= config.src %>/**/*.html',
                tasks: ['html'],
                options: {
                    spawn: false,
                    debounceDelay: 250
                }
            },
            bower: {
                files: '<%= bower.directory %>/**',
                tasks: ['default'],
                options: {
                    spawn: false,
                    debounceDelay: 5000
                }
            },
            js: {
                // Files to monitor for changes before running js task
                files: ['Gruntfile.js', 'package.json', '<%= config.src %>/**/*.js'],
                tasks: ['js'],
                options: {
                    spawn: false,
                    debounceDelay: 250
                }
            },
            less: {
                // Files to monitor for changes before running css task
                files: ['Gruntfile.js', 'package.json', '<%= config.src %>/**/*.less'],
                tasks: ['css'],
                options: {
                    spawn: false,
                    debounceDelay: 250
                }
            },
            json: {
                files: ['<%= config.src %>/**/*.json'],
                tasks: ['json'],
                options: {
                    spawn: false,
                    debounceDelay: 250
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

    grunt.loadNpmTasks('grunt-html');

    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.loadNpmTasks('grunt-prettify');

    grunt.loadNpmTasks('grunt-text-replace');

    grunt.loadNpmTasks('grunt-jsonlint');

    grunt.loadNpmTasks('grunt-modernizr');

    // ========================================================================
    // Register Tasks

    grunt.registerTask('html', [
//        'htmllint',         // Validates all HTML
        'prettify', // Cleans up the formatting, places output in `tmp`
        'htmlmin',  // Copies and minifies `tmp` HTML to `dist` folder,
                    // and copies unmodified `tmp` HTML to `test` folder
        'replace', // Renames source references in HTML from .min.* to .* in `test`
        'htmllint:processed' // Lints the processed output to ensure no funny business happened in the meantime
    ]);

    // Run 'grunt bower' to copy updated bower components into src
    grunt.registerTask('bower', ['copy:bower']);

    // Run 'grunt fonts' to copy fonts from src to dist and test
    grunt.registerTask('fonts', ['copy:fonts']);

    // Run 'grunt images' to copy images from src to dist and test
    grunt.registerTask('images', ['copy:images']);

    // Run 'grunt test' to view jshint, lesslint and HTML validator recommendations
    grunt.registerTask('test', [
        'validation',
        'jshint',
        'jsonlint',
        'lesslint'
    ]);

    grunt.registerTask('json', [
        'jsonlint',
        'copy:json'
    ]);

    // Run 'grunt csslint' to check LESS quality, and if no errors then
    // compile LESS into CSS, combine and minify
    grunt.registerTask('csslint', [
        'lesslint',
        'clean:css',
        'less',
        'cssmin'
    ]);

    // Run 'grunt css' to compile LESS into CSS, combine and minify
    grunt.registerTask('css', [
        'clean:css',
        'less',
        'cssmin',
        'copy:styleguide',
        'copy:testCSS'
    ]);

    // Run 'grunt js' to check JS code quality, and if no errors
    // concatonate and minify
    grunt.registerTask('js', [
        'copy:bower',
        'jshint',
        'clean:js',
        'concat',
//        'modernizr',
        'uglify',
        'copy:testJS'
    ]);

    // 'grunt' will:
    // - bring in new bower components
    // - check code quality, and if no errors,
    // - compile LESS to CSS,
    // - minify and concatonate all JS and CSS,
    // - prettify and minify HTML
    // - copy unprocessed files to /test directory for debugging

    grunt.registerTask('default', [
//        'htmllint:src',
        'copy:bower',
        'jshint',
        'clean',
        'less',
        'copy:styleguide',
        'cssmin',
        'concat',
//        'modernizr',    // Not included in standard tasks as it's a fairly long process
                        // Be sure to re-run `grunt modernizr` to update customised version after adding new tests
        'uglify',
        'copy:images',
        'copy:fonts',
        'copy:testDist',
        'copy:testJS',
        'copy:testCSS',
        'prettify',
        'htmlmin',
        'replace',
//        'htmllint:processed'
    ]);

};
