;(function () {
  'use strict'

  angular
    .module('app.index', [])
    .controller('IndexController', IndexController)

  IndexController.$inject = ['logger', '$state']
  /* @ngInject */
  function IndexController (logger, $state) {
    var vm = this

    activate()

    function activate () {
      logger.info('Activated Index View')
    }
  }
})()
