;(function () {
  'use strict'

  angular
    .module('app.user', [])
    .controller('UserController', UserController)

  UserController.$inject = ['$http', 'config']
  /* @ngInject */
  function UserController ($http, config) {
    var vm = this
    vm.loginCred = {}
    vm.user = vm.editProfile = config.user || {}

    vm.login = function () {
      console.log(vm.user)
      $http.post('/api/login', {
        email: vm.loginCred.email,
        password: vm.loginCred.password
      })
        .success(function () {
          window.location.href = '/'
          console.log(arguments)
          vm.loginCred = {}
        })
        .error(function () {
          console.log(arguments)
        })
    }
    vm.signup = function () {
      if (vm.loginCred.password === vm.loginCred.confirmPassword) {
        $http.post('/api/signup', vm.loginCred)
          .success(function () {
            console.log(arguments)

            vm.loginCred = {}
          })
          .error(function () {
            console.log(arguments)
          })
      }
    }

    vm.update = function () {
      console.log(vm.user)

      $http.post('/api/account/profile', vm.editProfile)
        .success(function () {
          alert('Change this Alert later - for now you data is saved')
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
