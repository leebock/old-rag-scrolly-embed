'use strict';
module.exports = function (grunt) {
 
  // Configuration

  grunt.initConfig({
    jshint: {
      build: [
        'js/*.js'
      ],
      options: {jshintrc: '.jshintrc', ignores:[]}
    },
    watch: {
      compile: {
        files: ['*.html','js/*.js',"css/main.css"],
        tasks: ['jshint'],
        options: {
          debounceDelay: 250,
          livereload: true
        }        
      }
    }        
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');  
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'watch:compile']);
  
};