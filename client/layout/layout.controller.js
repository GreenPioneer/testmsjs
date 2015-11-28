;(function () {
  'use strict'

  angular
    .module('app.layout')
    .controller('ShellController', ShellController)

  ShellController.$inject = []
  /* @ngInject */
  function ShellController () {
    var vm = this
    vm.busyMessage = 'Please wait ...'

  }
})()
