// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-03-07 using
// generator-karma 0.9.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-confirm-modal/angular-confirm.min.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-jqfile-upload/js/cors/jquery.postmessage-transport.js',
      'bower_components/angular-jqfile-upload/js/cors/jquery.xdr-transport.js',
      'bower_components/angular-jqfile-upload/js/vendor/jquery.ui.widget.js',
      'bower_components/angular-jqfile-upload/js/jquery.fileupload.js',
      'bower_components/angular-jqfile-upload/js/jquery.fileupload-process.js',
      'bower_components/angular-jqfile-upload/js/jquery.fileupload-validate.js',
      'bower_components/angular-jqfile-upload/js/jquery.fileupload-image.js',
      'bower_components/angular-jqfile-upload/js/jquery.fileupload-audio.js',
      'bower_components/angular-jqfile-upload/js/jquery.fileupload-video.js',
      'bower_components/angular-jqfile-upload/js/jquery.fileupload-ui.js',
      'bower_components/angular-jqfile-upload/js/jquery.fileupload-jquery-ui.js',
      'bower_components/angular-jqfile-upload/js/jquery.fileupload-angular.js',
      'bower_components/angular-jqfile-upload/js/jquery.iframe-transport.js',
      'bower_components/angular-jqfile-upload/js/app.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-pickadate/src/angular-pickadate.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/spin.js/spin.js',
      'bower_components/angular-spinner/angular-spinner.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/jquery-ui/jquery-ui.js',
      'bower_components/angular-ui-sortable/sortable.js',
      'bower_components/at-table/dist/angular-table.min.js',
      'bower_components/blueimp-file-upload/js/cors/jquery.postmessage-transport.js',
      'bower_components/blueimp-file-upload/js/cors/jquery.xdr-transport.js',
      'bower_components/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
      'bower_components/blueimp-file-upload/js/jquery.fileupload.js',
      'bower_components/blueimp-file-upload/js/jquery.fileupload-process.js',
      'bower_components/blueimp-file-upload/js/jquery.fileupload-validate.js',
      'bower_components/blueimp-file-upload/js/jquery.fileupload-image.js',
      'bower_components/blueimp-file-upload/js/jquery.fileupload-audio.js',
      'bower_components/blueimp-file-upload/js/jquery.fileupload-video.js',
      'bower_components/blueimp-file-upload/js/jquery.fileupload-ui.js',
      'bower_components/blueimp-file-upload/js/jquery.fileupload-jquery-ui.js',
      'bower_components/blueimp-file-upload/js/jquery.fileupload-angular.js',
      'bower_components/blueimp-file-upload/js/jquery.iframe-transport.js',
      'bower_components/FileSaver/FileSaver.js',
      'bower_components/jquery.iframe-transport/jquery.iframe-transport.js',
      'bower_components/jszip/dist/jszip.js',
      'bower_components/jszip-utils/dist/jszip-utils.js',
      'bower_components/ng-currency/dist/ng-currency.min.js',
      'bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
