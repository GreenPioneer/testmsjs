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
        state: 'time',
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
