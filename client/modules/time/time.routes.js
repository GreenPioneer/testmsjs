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
          url: '/time/create',
          templateUrl: 'modules/time/create.view.html',
          controller: 'TimeController',
          controllerAs: 'vm'
        }
      }

    ]
  }
})()
