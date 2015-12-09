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

  BlogController.$inject = ['$http', '$stateParams', 'BlogFactory', 'config', 'logger', '$location', 'UserFactory']
  /* @ngInject */
  function BlogController ($http, $stateParams, BlogFactory, config, logger, $location, UserFactory) {
    var vm = this
    vm.title = 'System'
    vm.blog = {}
    vm.UserFactory = UserFactory
    activate()

    vm.create = function () {
      var blog = new BlogFactory(vm.blog)
      blog.$save(function (response) {
        vm.blog = response.data.data
        // window.location.href = 
        $location.url('/blog/list')
      }, function (error) {
        console.log(arguments)
      })
    }

    vm.find = function () {
      BlogFactory.get({
        id: $stateParams.id
      }, function (success) {
        vm.blog = success.data
      }, function (error) {
        console.log(arguments)
      })
    }
    vm.list = function () {
      BlogFactory.get(function (success) {
        vm.blogs = success.data
      }, function (error) {
        console.log(arguments)
      })
    }
    vm.update = function (isValid) {
      if (isValid) {
        BlogFactory.update({
          id: $stateParams.id
        }, vm.blog,
          function (success) {
            $location.url('/blog/view/' + $stateParams.id)
          },
          function (error) {
            console.log(arguments)
          })
      }
    }
    vm.delete = function (blogId) {
      var deleteConfirm = confirm('Are you sure you want to delete this blog?')
      if (deleteConfirm === true) {
        BlogFactory.remove({
          id: blogId
        },
          function (success) {
            for (var i in vm.blogs) {
              if (vm.blogs[i]._id === blogId) {
                vm.blogs.splice(i, 1)
              }
            }
          // window.location.reload()
          },
          function (error) {
            console.log(arguments)
          })
      }
    }

    function activate () {
      logger.info('Activated Blog View')
    }
  }

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

})()
