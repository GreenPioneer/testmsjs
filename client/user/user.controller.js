;(function () {
  'use strict'

  angular
    .module('app.user', [])
    .controller('UserController', UserController)

  UserController.$inject = ['$http']
  /* @ngInject */
  function UserController ($http) {
    var vm = this
    vm.title = 'System'
    vm.user = {}
    vm.login = function () {
      console.log(vm.user)
      $http.post('/api/login', {
        email: vm.user.email,
        password: vm.user.password
      })
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
