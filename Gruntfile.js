/* global module: false, require: false, __dirname: false, process: false */

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        '<%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        watch: {
            less: {
                files: [ 'app/src/styles/**/*.less' ],
                tasks: [ 'less' ]
            },
            js: {
                files: [ 'app/src/scripts/**/*.js' ],
                tasks: [ 'browserify' ]
            }
        },

        clean: {
            deploy: [ 'release/src' ]
        },

        browserify: {
            options: {
                debug: true,
                transform: ['reactify'],
                extensions: ['.jsx']
            },
            dist: {
                files: { 'app/public/scripts/scripts.js': 'app/src/scripts/scripts.js'}
            }
        },

        less: {
            development: {
                options: {
                    paths: 'app/src/styles',
                    cleancss: true
                },
                files: {
                    'app/public/styles/styles.css': 'app/src/styles/styles.less'
                }
            }
        },

        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/src/images',
                        src: ['**'],
                        dest: 'app/public/images/'
                    },
                    {
                        src: 'app/public/packages/modernizr/modernizr.js',
                        dest: 'app/public/scripts/modernizr.js'
                    },
                    {
                        expand: true,
                        cwd: 'app/src/fonts',
                        src: ['**'],
                        dest: 'app/public/fonts'
                    }
                ]
            },
            deploy: {
                files: [
                    {
                        expand: true,
                        cwd: 'app',
                        src: ['**'],
                        dest: 'release'
                    }
                ]
            }
        },

        concurrent: {
            dev: {
                tasks: [
                    'copy:build',
                    'browserify',
                    'less',
                    'proxy:dev',
                    'server',
                    'watch'
                ],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // Load npm tasks.
    grunt.util._.each([
        'contrib-clean',
        'contrib-copy',
        'contrib-watch',
        'concurrent',
        'contrib-less',
        'browserify'
    ], function (tasks) {
        grunt.loadNpmTasks('grunt-' + tasks);
    });

    grunt.registerTask('proxy', function () {
        var done = this.async();
        var app = require('./utils/proxy')();
        app.on('close', done);
    });

    grunt.registerTask('server', function() {
        var done = this.async();
        var app = require('./server');
        app.on('close', done);
    });

    grunt.registerTask('build', [
        'copy:build',
        'browserify',
        'less'
    ]);

    grunt.registerTask('default', ['concurrent:dev']);

    grunt.registerTask('deploy', ['copy:build', 'browserify', 'less', 'copy:deploy', 'clean:deploy']);
};
