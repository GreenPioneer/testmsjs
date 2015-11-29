;(function () {
  'use strict'

  angular
    .module('app.layout')
    .controller('ShellController', ShellController)

  ShellController.$inject = ['config', 'logger']
  /* @ngInject */
  function ShellController (config, logger) {
    var vm = this
    vm.busyMessage = 'Please wait ...'
    activate()

    function activate () {
      console.log(config)
    }
  }
})()
