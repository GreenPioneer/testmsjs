;(function () {
  'use strict'

  angular
    .module('app.time')
    .factory('TimeFactory', TimeFactory)

  TimeFactory.$inject = ['$resource']
  /* @ngInject */
  function TimeFactory ($resource) {
    return $resource('/api/v1/Time/:timeId', {
      timeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }
}())
