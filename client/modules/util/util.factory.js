;(function () {
  'use strict'

  angular
    .module('app.util')
    .factory('logger', logger)
    .factory('exception', exception)

  logger.$inject = ['$log', 'toastr']

  /* @ngInject */
  function logger ($log, toastr) {
    var service = {
      showToasts: true,

      error: error,
      info: info,
      success: success,
      warning: warning,

      // straight to console; bypass toastr
      log: $log.log
    }

    return service
    // ///////////////////

    function error (message, data, title) {
      toastr.error(message, title)
      $log.error('Error: ' + message, data)
    }

    function info (message, data, title) {
      toastr.info(message, title)
      $log.info('Info: ' + message, data)
    }

    function success (message, data, title) {
      toastr.success(message, title)
      $log.info('Success: ' + message, data)
    }

    function warning (message, data, title) {
      toastr.warning(message, title)
      $log.warn('Warning: ' + message, data)
    }
  }
  /* @ngInject */
  function exception ($q, logger) {
    var service = {
      catcher: catcher
    }
    return service

    function catcher (message) {
      return function (e) {
        var thrownDescription
        var newMessage
        if (e.data && e.data.description) {
          thrownDescription = '\n' + e.data.description
          newMessage = message + thrownDescription
        }
        e.data.description = newMessage
        logger.error(newMessage)
        return $q.reject(e)
      }
    }
  }
}())
;(function () {
  'use strict'


})()
