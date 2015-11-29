;(function () {
  'use strict'

  angular
    .module('app.user')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'login',
        config: {
          url: '/login',
          templateUrl: './user/login.view.html',
          controller: 'UserController',
          controllerAs: 'vm'
        }
      }
    ]
  }
})()
