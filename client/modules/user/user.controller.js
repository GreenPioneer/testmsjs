;(function () {
  'use strict'

  angular
    .module('app.user', [])
    .controller('UserController', UserController)

  UserController.$inject = ['$http', 'config', '$location', '$timeout', 'UserFactory']
  /* @ngInject */
  function UserController ($http, config, $location, $timeout, UserFactory) {
    var vm = this
    vm.editProfile = vm.loginCred = vm.loginError = {}
    vm.editProfile = UserFactory.editProfile(vm)
    vm.login = function () {
      UserFactory.login(vm)

    // .success(function () {
    //   // $location.path('/')
    //   window.location.href = '/'
    //   console.log(arguments)
    //   vm.loginCred = {}
    // })
    // .error(function () {
    //   console.log(arguments)
    // })
    }
    vm.signup = function () {
      UserFactory.signup(vm)
    }

    vm.update = function () {
      UserFactory.update(vm)
    }

    activate()

    function activate () {
      console.log('Activated UserController View')
    }
  }
})()
