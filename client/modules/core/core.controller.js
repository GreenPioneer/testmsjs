;(function () {
  'use strict'

  angular
    .module('app.core')
    .controller('CoreController', LayoutController)

  LayoutController.$inject = ['config', 'logger']
  /* @ngInject */
  function LayoutController (config, logger) {
    var vm = this
    vm.busyMessage = 'Please wait ...'
    activate()

    function activate () {
      console.log(config)
    }
  }
})()
