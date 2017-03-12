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
      server: {
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
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default',['connect']);

}
