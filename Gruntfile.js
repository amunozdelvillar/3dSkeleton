module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 9000,
          keepalive: true,
          open: true,
        }
      }
    },

    watch: {
      configFiles: {
        files: [ 'Gruntfile.js', 'app/*.html' ],
        options: {
        reload: true
    }
  }
}
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('server', ['connect:server']);
};