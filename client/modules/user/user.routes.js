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
          templateUrl: 'modules/user/login.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedout: function (UserFactory) {
              return UserFactory.checkLoggedOut()
            }
          }
        }
      },
      {
        state: 'signup',
        config: {
          url: '/signup',
          templateUrl: 'modules/user/signup.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedout: function (UserFactory) {
              return UserFactory.checkLoggedOut()
            }
          }
        }
      },
      {
        state: 'account',
        config: {
          url: '/account',
          templateUrl: 'modules/user/account.view.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            loggedin: function (UserFactory) {
              return UserFactory.checkLoggedin()
            }
          }
        }
      }
    ]
  }
})()
