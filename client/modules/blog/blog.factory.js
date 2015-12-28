;(function () {
  'use strict'

  angular
    .module('app.blog')
    .factory('BlogFactory', BlogFactory)

  // BlogFactory.$inject = ['$resource']
  // /* @ngInject */
  // function BlogFactory ($resource) {
  //   return $resource('/api/v1/Blog/:blogId', {
  //     blogId: '@_id'
  //   }, {
  //     update: {
  //       method: 'PUT'
  //     }
  //   })
  // }
  BlogFactory.$inject = ['$resource']
  /* @ngInject */
  function BlogFactory ($resource) {
    return $resource('/api/v1/Blog/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }
}())
