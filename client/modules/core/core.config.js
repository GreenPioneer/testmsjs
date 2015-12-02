/* global angular:false toastr:false, moment:false */

;(function () {
  'use strict'

  var core = angular.module('app.core')

  core.config(toastrConfig)
  core.constant('toastr', toastr)
  core.constant('moment', moment)
  toastrConfig.$inject = ['toastr']
  /* @ngInject */
  function toastrConfig (toastr) {
    toastr.options.timeOut = 4000
    toastr.options.positionClass = 'toast-bottom-right'
  }

  var config = {
    appErrorPrefix: '[helloWorld Error] ',
    appTitle: 'helloWorld',
    user: window.user
  }

  core.value('config', config)

  core.config(configure)

  configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider']
  /* @ngInject */
  function configure ($logProvider, routerHelperProvider, exceptionHandlerProvider) {
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true)
    }
    exceptionHandlerProvider.configure(config.appErrorPrefix)
    routerHelperProvider.configure({docTitle: config.appTitle + ': '})
  }

})()
