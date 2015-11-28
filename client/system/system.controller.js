;(function () {
  'use strict'

  angular
    .module('app.system', [])
    .controller('SystemController', SystemController)

  SystemController.$inject = []
  /* @ngInject */
  function SystemController () {
    var vm = this
    vm.title = 'System'

    activate()

    function activate () {
      console.log('Activated SystemController View')
    }
  }
})()
