module.exports = function (grunt){

  var rewrite = require( "connect-modrewrite" );

  grunt.initConfig({

    connect: {
      options: {
        middleware: function ( connect, options, middlewares ) {
            var rules = [
                "!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif$ /index.html"
            ];
            middlewares.unshift( rewrite( rules ) );
            return middlewares;
        }
    },
      local: {
        options: {
          hostname: '*',
          port: 8080,
          keepalive: true,
          open:
          {
            target: 'http://localhost:8080', // target url to open
            chrome: 'open', // name of the app that opens, ie: open, start, xdg-open
          }
        }
      },
      prod: {
        options: {
          hostname: '*',
          port: 8080,
          base: 'dist/',
          keepalive: true,
          open:
          {
            target: 'http://localhost:8080', // target url to open
            chrome: 'open', // name of the app that opens, ie: open, start, xdg-open
          }
        }
      }
    },
    clean:{
      temp: ['dist/js/libs.min.js', 'dist/js/scripts.js', 'dist/js/scripts.min.js'],
      all: ['dist/']
    },
    concat:{
      scripts: {
        src: [
          'js/app.js',
          'js/timezoneService.js',
          'js/meetingCtrl.js'
        ],
        dest: 'dist/js/scripts.js'
      },
      libs: {
        src: [
          'node_modules/angular/angular.min.js',
          'node_modules/angular-route/angular-route.min.js',
          'node_modules/angular-resource/angular-resource.min.js',
          'node_modules/angular-aria/angular-aria.min.js',
          'node_modules/angular-animate/angular-animate.min.js',
          'node_modules/angular-messages/angular-messages.min.js',
          'node_modules/angular-sanitize/angular-sanitize.min.js',
          'node_modules/angular-material/angular-material.min.js',
          'node_modules/moment/min/moment.min.js'
        ],
        dest: 'dist/js/libs.min.js'
      },
      all: {
        src: ['dist/js/libs.min.js','dist/js/scripts.min.js'],
        dest: 'dist/js/all.min.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      scripts:{
        src: ['dist/js/scripts.js'],
        dest: 'dist/js/scripts.min.js'
      }
    },
    cssmin:{
      all: {
        src: [
          'node_modules/angular-material/angular-material.css',
          'styles/app.css'
        ],
        dest: 'dist/css/styles.min.css'
      }
    },
    copy: {
      all: {
        src: 'index-prod.html',
        dest: 'dist/index.html'
      }
    },
    sass: {
    dist: {
      files: {
        'styles/app.css': 'styles/style.scss'
      }
    }
  }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');



  grunt.registerTask('prod',['clean:all', 'sass' ,'concat:scripts', 'uglify', 'concat:libs','concat:all', 'cssmin', 'copy:all', 'clean:temp', 'connect:prod']);
  grunt.registerTask('local',['connect:local']);


}
