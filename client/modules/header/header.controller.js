;(function () {
  'use strict'

  angular
    .module('app.header')
    .controller('HeaderController', HeaderController)

  HeaderController.$inject = ['config', 'logger', '$http']
  /* @ngInject */
  function HeaderController (config, logger, $http) {
    var vm = this
    activate()
    vm.location = 'Header'
    vm.user = config.user
    function activate () {
    }
  }
})()
