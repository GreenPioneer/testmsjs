;(function () {
  'use strict'

  angular
    .module('app.header')
    .controller('HeaderController', HeaderController)

  HeaderController.$inject = ['config', 'logger', '$http', 'UserFactory', '$rootScope']
  /* @ngInject */
  function HeaderController (config, logger, $http, UserFactory, $rootScope) {
    var vm = this
    activate()
    vm.location = 'Header'
    vm.UserFactory = UserFactory

    vm.logout = function () {
      vm.UserFactory = {}
      UserFactory.logout(vm)
    }

    $rootScope.$on('profileUpdated', function () {
      // if you want to do anything extra
      vm.UserFactory = UserFactory
    })
    $rootScope.$on('loggedin', function () {
      // if you want to do anything extra
      console.log(UserFactory, 'loggedin')
      vm.UserFactory = UserFactory
    })

    $rootScope.$on('logout', function () {
      // if you want to do anything extra
      vm.UserFactory = {}
    })

    function activate () {
    }
  }
})()
