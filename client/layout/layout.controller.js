;(function () {
  'use strict'

  angular
    .module('app.layout')
    .controller('LayoutController', LayoutController)

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
