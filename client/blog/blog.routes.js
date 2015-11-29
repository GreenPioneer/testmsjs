;(function () {
  'use strict'

  angular
    .module('app.blog')
    .run(appRun)

  appRun.$inject = ['routerHelper']
  /* @ngInject */
  function appRun (routerHelper) {
    routerHelper.configureStates(getStates())
  }

  function getStates () {
    return [
      {
        state: 'create',
        config: {
          url: '/create',
          templateUrl: './blog/create.view.html',
          controller: 'BlogController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'edit',
        config: {
          url: '/edit/:id',
          templateUrl: './blog/edit.view.html',
          controller: 'BlogController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'list',
        config: {
          url: '/list',
          templateUrl: './blog/list.view.html',
          controller: 'BlogController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'view',
        config: {
          url: '/view/:id',
          templateUrl: './blog/view.view.html',
          controller: 'BlogController',
          controllerAs: 'vm'
        }
      }

    ]
  }
})()
