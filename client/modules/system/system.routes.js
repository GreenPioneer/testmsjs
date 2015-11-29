;(function () {
  'use strict'

  angular
    .module('app.system')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'system',
        config: {
          url: '/',
          templateUrl: 'modules/system/system.view.html',
          controller: 'SystemController',
          controllerAs: 'vm',
          title: 'System',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> System'
          }
        }
      }
    ]
  }
})()
