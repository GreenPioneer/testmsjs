;(function () {
  'use strict'

  angular
    .module('app.time')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }
  function getStates () {
    return [
      {
        state: 'time create',
        config: {
          url: '/time/create',
          templateUrl: 'modules/time/create.view.html',
          controller: 'TimeController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'time list',
        config: {
          url: '/time/list',
          templateUrl: 'modules/time/list.view.html',
          controller: 'TimeController',
          controllerAs: 'vm'
        }
      }
    ]
  }
})()
