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

        // Some configuration variables
        config: config,
        pkg: grunt.file.readJSON('./package.json'),
        bower: grunt.file.readJSON('./.bowerrc'),

        // =====================================================================
        //
        //      Clean (delete) files and folders.
        //
        //      https://github.com/gruntjs/grunt-contrib-clean
        //
        clean: {
            dist: [
                '<%= config.dist %>/'
            ],
            html: [
                '<%= config.dist %>/*.html',
//                '<%= config.dist %>/htmlmin/*.html',
                '<%= config.tmp %>/*.html',
            ],
            images: '<%= config.dist %>/img',
            css: [
                '<%= config.src %>/css/*.css',
//                '<%= config.dist %>/css/*.css',
                '<%= config.styleguide %>/css/*.css'
            ],
//            js: '<%= config.dist %>/js'

        },

        // =====================================================================
        //
        //      Concatenate files.
        //
        //      https://github.com/gruntjs/grunt-contrib-concat
        //
        concat: {
            options: {
                separator: '\n',
                // Remove duplicate 'use strict' declarations
                banner: "// ** Built automatically in Grunt, do not edit **\n'use strict';\n",
                process: function(src, filepath) {
                    return '\n// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            vendor: {
                files: {
                    '<%= config.src %>/js/vendor.js': [
                        '<%= config.src %>/js/vendor/jquery-plugins/*.js',
                        '<%= config.src %>/js/vendor/xregexp/xregexp.js',
                        '<%= config.src %>/js/vendor/xregexp/xregexp-*.js'
                    ]
                }
            },
            lib: {
                files: {
                    // Note, the p3.lib file will only generate a library from files beginning with p3.
                    '<%= config.src %>/js/p3.lib.js': '<%= config.src %>/js/lib/p3.*.js'
                }
            }
        },

        // =====================================================================
        //
        //      Compile LESS files to CSS
        //
        //      https://github.com/jzaefferer/grunt-html
        //
        copy: {
            styleguide: {
                nonull: true,
                src: '<%= config.src %>/css/styleguide.css',
                dest: '<%= config.styleguide %>/css/styleguide.css'
            },
            // Copy bower components into src
            bower: {
                files: [{
                    "<%= config.src %>/js/vendor/jquery.min.js": "<%= bower.directory %>/jquery/dist/jquery.min.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.placeholder.js": "<%= bower.directory %>/jquery-placeholder/jquery.placeholder.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.timeago.js": "<%= bower.directory %>/jquery-timeago/jquery.timeago.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.validate.js": "<%= bower.directory %>/jquery-validation/jquery.validate.js",
                    "<%= config.src %>/js/vendor/jquery-plugins/jquery.cookie.js": "<%= bower.directory %>/jquery.cookie/jquery.cookie.js",
                    "<%= config.src %>/js/vendor/compat/json.min.js": "<%= bower.directory %>/json3/lib/json3.min.js",
                    "<%= config.src %>/js/vendor/xregexp/xregexp.js": "<%= bower.directory %>/xregexp/src/xregexp.js",
                    "<%= config.src %>/js/vendor/xregexp/xregexp-unicode-base.js": "<%= bower.directory %>/xregexp/src/addons/unicode/unicode-base.js",
                    "<%= config.src %>/js/vendor/xregexp/xregexp-unicode-categories.js": "<%= bower.directory %>/xregexp/src/addons/unicode/unicode-categories.js"
                },
                // Font Awesome LESS files
                {
                    expand: true,
                    cwd: '<%= bower.directory %>/fontawesome/less/',
                    src: ['*'],
                    dest: '<%= config.src %>/less/components/font-awesome/'
                }, {
                    expand: true,
                    cwd: '<%= bower.directory %>/fontawesome/fonts/',
                    src: ['*'],
                    dest: '<%= config.src %>/fonts/'
                }]
            },
            // Copy src fonts to dist
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.src %>/fonts/',
                        src: ['*'],
                        dest: '<%= config.dist %>/fonts/'
                    }
                ]
            },
            // Copy src HTML to dist
            html: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.src %>/',
                        src: ['*.html', '!testing-*.html'],
                        dest: '<%= config.dist %>/'
                    }
                ]
            },
            // Copy src images to dist
            images: {
                files: [

                    {
                        expand: true,
                        cwd: '<%= config.src %>/img/',
                        src: ['*'],
                        dest: '<%= config.dist %>/img/'
                    }
                ]
            },
            // Copy src json to dist
            json: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.src %>/json/',
                        src: ['**'],
                        dest: '<%= config.dist %>/json/'
                    }
                ]
            },
            // Copy p3.lib.js to dist for processing
            p3: {
                files: {
                    '<%= config.dist %>/js/p3.lib.js': '<%= config.src %>/js/p3.lib.js'
                }
            },
            // Formats HTML, output to /tmp
            prettyHTML: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.tmp %>/',
                        src: ['*.html'],
                        dest: '<%= config.src %>/'
                    }
                ]
            }
        },

        // =====================================================================
        //
        //      Compile LESS files to CSS
        //
        //      https://github.com/jzaefferer/grunt-html
        //
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

        // =====================================================================
        //
        //      Validate files with JSHint.
        //
        //      https://github.com/gruntjs/grunt-contrib-jshint
        //
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
            files: ['<%= config.src %>/js/lib/*.js', '<%= config.src %>/js/*.js', '!<%= config.src %>/js/p3.lib.js', '!<%= config.src %>/js/vendor.js']
        },

        // =====================================================================
        //
        //      Validate JSON files from grunt.
        //
        //      https://github.com/brandonramirez/grunt-jsonlint
        //
        jsonlint: {
            countries: {
                src: ['<%= config.src %>/**/*.json']
            }
        },

        // =====================================================================
        //
        //      Html validation, using the vnu.jar markup checker.
        //
        //      https://github.com/jzaefferer/grunt-html
        //
        htmllint: {
            options: {
                ignore: [
                    'Bad value “X-UA-Compatible” for attribute “http-equiv” on XHTML element “meta”.',
                    // NESTED form tags! Nested FORM tags! ** NESTED FORM TAGS! **
                    'Saw a “form” start tag, but there was already an active “form” element. Nested forms are not allowed. Ignoring the tag.',
                    'End tag “form” seen, but there were open elements.'
                ]
            },
            src: ["<%= config.src %>/**/*.html"],
            processed: [
                "<%= config.dist %>/**/*.html",
                "<%= config.test %>/**/*.html"
            ],
            styleguide: ["<%= config.styleguide %>/**/*.html"]
        },
        // =====================================================================
        //
        //      Minify HTML
        //
        //      https://github.com/gruntjs/grunt-contrib-htmlmin
        //
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {// Copy production HTML from tmp to dist, except for testing
                        expand: true,
                        cwd: '<%= config.tmp %>',
                        src: ['*.html', '!testing*.html'],
                        dest: '<%= config.dist %>/htmlmin/'
                    }
                ]
            }
        },

        // =====================================================================
        //
        //      Compile LESS files to CSS
        //
        //      https://github.com/gruntjs/grunt-contrib-less
        //
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

        // =====================================================================
        //
        //      This plugin compiles your LESS files, runs the generated CSS
        //      through CSS Lint, and outputs the offending LESS line for any
        //      CSS Lint errors found
        //
        //      https://github.com/jgable/grunt-lesslint
        //
        lesslint: {
            src: ['<%= config.src %>/less/*.less']
        },

        // =====================================================================
        //
        //      Sifts through project files, gathers up references
        //      to Modernizr tests and outputs a lean, mean Modernizr machine.
        //
        //      https://github.com/Modernizr/grunt-modernizr
        //
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

        // =====================================================================
        //
        //      Format HTML to a 'prettier' standard
        //
        //      https://github.com/jonschlinkert/grunt-prettify
        //
        prettify: {
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

        // =====================================================================
        //
        //      Search and replace in strings
        //
        //      https://www.npmjs.org/package/grunt-text-replace
        //
        replace: {
            distHTML: {
                src: ['<%= config.dist %>/*.html'],
                dest: ['<%= config.dist %>/'],
                replacements: [
                    // Remove vendor from src files as the dist javascript
                    // structure is flat (other than compat)
                    {
                        from: 'vendor/',
                        to: ''
                    },
                    // Replace all
                    {
                        from: /\s(src|href)(=".*)\.(js|css)"/g,
                        to: ' $1$2.min.$3"'
                    },
                    // Because javascript can't do negative lookbehind
                    // replace any duplicate mins added by previous step
                    {
                        from: '.min.min',
                        to: '.min'
                    }
                ]
            },
            console: {
                src: ['<%= config.dist %>/js/p3.lib.js'],
                overwrite: true,
                replacements: [
                    // Remove any remaining console.log calls for live
                    {
                        from: /console.log\(.+?\);/g,
                        to: ''
                    }
                ]
            }
        },

        // =====================================================================
        //
        //      Minify files with UglifyJS.
        //
        //      https://github.com/gruntjs/grunt-contrib-uglify
        //
        uglify: {
            options: {
                banner: '/*\n * @name\t\t<%= pkg.name %>\n * @version\t\tv<%= pkg.version %>\n * ' +
                    '@date\t\t<%= grunt.template.today("yyyy-mm-dd") %>\n * @copyright\t<%= pkg.copyright %>\n * @source\t\t<%= pkg.repository %>*/\n/* @license <%= pkg.license %> */\n',
//                report: 'gzip',
                footer: '\n/* @license-end */',
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
                    '<%= config.dist %>/js/vendor.min.js': '<%= config.src %>/js/vendor.js'
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
                    '<%= config.dist %>/js/p3.lib.min.js': ['<%= config.src %>/js/p3.lib.js'],
                    '<%= config.dist %>/js/site.min.js': ['<%= config.src %>/js/site.js'],
                    '<%= config.dist %>/js/action-template.min.js': ['<%= config.src %>/js/action-template.js'],
                    '<%= config.dist %>/js/action-template-full.min.js': ['<%= config.src %>/js/action-template-full.js'],
                    '<%= config.dist %>/js/action-template-ocean.min.js': ['<%= config.src %>/js/action-template-ocean.js'],
                    '<%= config.dist %>/js/action-template-thankyou.min.js': ['<%= config.src %>/js/action-template-thankyou.js'],
                    '<%= config.dist %>/js/action-template-ocean-thankyou.min.js': ['<%= config.src %>/js/action-template-ocean-thankyou.js']
                }
            }
        },

        // =====================================================================
        //
        //      Run predefined tasks whenever watched file patterns are added,
        //      changed or deleted.
        //
        //      https://github.com/gruntjs/grunt-contrib-watch
        //
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
                    debounceDelay: 1000
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
        'htmllint:src',         // Validates all source HTML
        'prettify',             // Cleans up the formatting, places output in `tmp`
//        'htmlmin',              // Copies and minifies `tmp` HTML to `dist` folder,
                                // and copies unmodified `tmp` HTML to `test` folder
//        'replace:dist',         // Renames file references in HTML from .js and .css to .min.js and .min.css in `dist`
//        'htmllint:processed'  // Lints the processed output to ensure no funny business happened in the meantime
    ]);

    // Run 'grunt bower' to copy updated bower components into src
    grunt.registerTask('bower', ['copy:bower']);

    // Run 'grunt fonts' to copy fonts from src to dist and test
    grunt.registerTask('fonts', ['copy:fonts']);

    // Run 'grunt images' to copy images from src to dist and test
    grunt.registerTask('images', ['copy:images']);

    // Run 'grunt test' to view jshint, lesslint and HTML validator recommendations
    grunt.registerTask('test', [
        'jshint',
        'jsonlint',
        'lesslint',
        'htmllint'
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
//        'cssmin'
    ]);

    // Run 'grunt css' to compile LESS into CSS, combine and minify
    grunt.registerTask('css', [
        'clean:css',
        'less',
//        'cssmin',
//        'copy:styleguide',
//        'copy:testCSS'
    ]);

    // Run 'grunt js' to check JS code quality, and if no errors
    // concatonate and minify
    grunt.registerTask('js', [
//        'copy:bower',
        'jshint',
//        'clean:js',
        'concat',
//        'modernizr',
//        'uglify',
//        'copy:testJS'
    ]);

    // 'grunt' will:

    // - check code quality, and if no errors,
    // - compile LESS to CSS,
    // - minify and concatonate all JS and CSS,
    // - prettify and minify HTML

    grunt.registerTask('default', [
        'copy:bower',       // Copy bower components into /src
        'htmllint:src',     // Check HTML code quality


        'jshint',           // Check javascript code quality
        'clean',            // Cleans all processed folders: /dist /src/css /styleguide/css /tmp
        'less',             // Compiles LESS to CSS
        'copy:styleguide',  // Copies Styleguide CSS files
        'cssmin',           // Minifies CSS files and copies them to /dist
        'concat',           // Concatonates Javascript files together
        'modernizr',        // Builds an optimised Modernizr automatically tailored to project tests
//        'replace:console',    // Copies p3.lib.js to /dist
        'uglify',           // Minifies Javascript files, and places the output in /dist
        'jsonlint',         // Check quality of the src JSON
        'copy:json',        // Copies JSON files from /src/json to /dist/json
        'copy:images',      // Copies the /src/images folder to /dist/images
        'copy:fonts',       // Copies the /src/fonts folder to /dist/fonts
        'copy:html',        // Copy /src HTML files to /dist
        'replace:distHTML', // Replace references in dist HTML to minified files
        'prettify',         // Formats /src HTML to a prettier standard, output to /tmp
        'copy:prettyHTML',  // Copies /tmp/*.html to /src
//        'htmllint:processed'// Re-checks that processed /dist HTML is still valid
    ]);

    grunt.registerTask('dist', [
        'clean:dist',       // Cleans /dist folder
        'cssmin',           // Minifies CSS files and copies them to /dist
        'copy:p3',          // Copies p3.lib.js to /dist
        'replace:console',
        'uglify',           // Minifies Javascript files, and places the output in /dist
        'jsonlint',         // Check quality of the src JSON
        'copy:json',        // Copies JSON files from /src/json to /dist/json
        'copy:images',      // Copies the /src/images folder to /dist/images
        'copy:fonts',       // Copies the /src/fonts folder to /dist/fonts
        'copy:html',        // Copy /src HTML files to /dist
        'replace:distHTML', // Replace references in dist HTML to minified files
//        'htmllint:processed'// Re-checks that processed /dist HTML is still valid
    ]);

};
