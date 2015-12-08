;(function () {
  'use strict'

  angular
    .module('app.user', [])
    .controller('UserController', UserController)

  UserController.$inject = ['$http', 'config', '$location', '$timeout', 'UserFactory', 'logger', 'Upload']
  /* @ngInject */
  function UserController ($http, config, $location, $timeout, UserFactory, logger, Upload) {
    var vm = this
    vm.editProfile = vm.loginCred = vm.loginError = {}
    vm.editProfile = UserFactory.editProfile(vm)
    vm.logger = logger
    vm.login = function () {
      UserFactory.login(vm)
    }
    vm.signup = function () {
      UserFactory.signup(vm)
    }

    vm.update = function () {
      UserFactory.update(vm)
    }

    vm.upload = function (file) {
      Upload.upload({
        url: '/api/photos/upload',
        data: {file: file, 'user': UserFactory}
      }).then(function (resp) {
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data)
      }, function (resp) {
        console.log('Error status: ' + resp.status)
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total)
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name)
      })
    }
    activate()

    function activate () {
      console.log('Activated UserController View')
    }
  }
})()
