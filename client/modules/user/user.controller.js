;(function () {
  'use strict'

  angular
    .module('app.user', [])
    .controller('UserController', UserController)

  UserController.$inject = ['$http', 'config']
  /* @ngInject */
  function UserController ($http, config) {
    var vm = this
    vm.user =
      vm.user = config.user || {}

    vm.login = function () {
      console.log(vm.user)
      $http.post('/api/login', {
        email: vm.user.email,
        password: vm.user.password
      })
        .success(function () {
          window.location.href = '/'
          console.log(arguments)
        })
        .error(function () {
          console.log(arguments)
        })
    }
    vm.signup = function () {
      if (vm.user.password === vm.user.confirmPassword) {
        $http.post('/api/signup', vm.user)
          .success(function () {
            console.log(arguments)
          })
          .error(function () {
            console.log(arguments)
          })
      }
    }

    vm.update = function () {
      console.log(vm.user)

      $http.post('/api/account/profile', vm.user)
        .success(function () {
          console.log(arguments)
        })
        .error(function () {
          console.log(arguments)
        })
    }

    activate()

    function activate () {
      console.log('Activated UserController View')
    }
  }
})()
