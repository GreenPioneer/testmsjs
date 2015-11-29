;(function () {
  'use strict'

  angular
    .module('app.header')
    .controller('HeaderController', HeaderController)

  HeaderController.$inject = ['config', 'logger']
  /* @ngInject */
  function HeaderController (config, logger) {
    var vm = this
    activate()
    vm.user = config.user
    function activate () {
    }
  }
})()
