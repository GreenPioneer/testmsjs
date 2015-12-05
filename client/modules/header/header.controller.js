;(function () {
  'use strict'

  angular
    .module('app.header')
    .controller('HeaderController', HeaderController)

  HeaderController.$inject = ['config', 'logger', '$http', 'UserFactory']
  /* @ngInject */
  function HeaderController (config, logger, $http, UserFactory) {
    var vm = this
    activate()
    vm.location = 'Header'
    vm.UserFactory = UserFactory

    vm.logout = function () {
      vm.user = config.user = {}
      vm.UserFactory = {}
      UserFactory.logout(vm)
    }
    function activate () {
    }
  }
})()
