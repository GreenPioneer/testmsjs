;(function () {
  'use strict'

  angular
    .module('app.blog', [])
    .controller('BlogController', BlogController)
    .factory('BlogFactory', BlogFactory)
    .config(config)

  function config ($httpProvider) {
    $httpProvider.defaults.xsrfHeaderName = '_csrf'
    $httpProvider.defaults.xsrfCookieName = 'x-xsrf-token'
  }

  BlogController.$inject = ['$http', '$stateParams', 'BlogFactory']
  /* @ngInject */
  function BlogController ($http, $stateParams, BlogFactory) {
    var vm = this
    vm.title = 'System'
    vm.blog = vm.user = {}
    activate()

    vm.create = function () {
      var blog = new BlogFactory(vm.blog)
      blog.$save(function (response) {
        vm.blog = response.data.data
        window.location.href = '/blog/list'
      }, function () {
        console.log(arguments)
      })
    }
    vm.find = function () {
      $http.get('/api/v1/Blog/' + $stateParams.id).then(function (response) {
        vm.blog = response.data.data
      }, function () {
        console.log(arguments)
      })
    }
    vm.list = function () {
      $http.get('/api/v1/Blog').then(function (response) {
        vm.blogs = response.data.data
      }, function () {
        console.log(arguments)
      })
    }
    vm.update = function () {
      $http.put('/api/v1/Blog/' + $stateParams.id, vm.blog).then(function (response) {
        vm.blog = response.data.data
        window.location.href = '/blog/view/' + $stateParams.id
      }, function () {
        console.log(arguments)
      })
    }
    vm.delete = function (blogId) {
      var deleteConfirm = confirm('Are you sure you want to delete this blog?')
      if (deleteConfirm === true) {
        $http.delete('/api/v1/Blog/' + blogId).then(function (response) {
          console.log(response)
          window.location.reload()
        }, function () {
          console.log(arguments)
        })
      }
    }

    function activate () {
      console.log('Activated BlogController View')
    }
  }

  BlogFactory.$inject = ['$resource']
  /* @ngInject */
  function BlogFactory ($resource) {
    return $resource('/api/v1/Blog/:blogId', {
      blogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }

})()
