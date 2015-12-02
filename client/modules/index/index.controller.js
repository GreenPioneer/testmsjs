;(function () {
  'use strict'

  angular
    .module('app.index', [])
    .controller('IndexController', IndexController)

  IndexController.$inject = []
  /* @ngInject */
  function IndexController () {
    var vm = this
    vm.title = 'System'

    activate()

    function activate () {
      console.log('Activated IndexController View')
    }
  }
})()
