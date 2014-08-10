/* global module: false, require: false, __dirname: false, process: false */

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        '<%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['static/js/*.js'],
        dest: 'static/dist/<%= pkg.name %>.js'
      }
    },
    less: {
      build: {
        options: {
          paths: 'static/css/less',
          cleancss: true
        },
        files: {
          'static/css/screen.css': 'statics/css/less/screen.less'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      dist: {
        files: {
          'static/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    clean: {
      build: ['static/dist/*', 'static/css/less/*']
    },
    jshint: {
      files: ['Gruntfile.js', 'static/js/*.js'],
      options: {
        globals: {
          bitwise: false,
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true,
          boss: true,
          eqnull: true,
          browser: true,
          es3: true,
          globals: {
            'global': false,
            'define': false,
            'require': true,
            'console': true
          },
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    run: {
      options: {

      },
      tenlines: {
        cmd: 'node app.js',
        // args: { }
      }
    },
    watch: {
      less: {
        files: [ 'static/css/less' ],
        tasks: [ 'less:build' ]
      }
      // js: {
      //   files: ['<%= jshint.files %>'],
      //   tasks: ['jshint']
      // }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['clean', 'uglify', 'jshint', 'concat', 'run']);

  grunt.registerTask('default', ['build']);

};