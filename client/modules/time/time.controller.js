;(function () {
  'use strict'

  angular
    .module('app.time', [])
    .controller('TimeController', TimeController)
    .factory('TimeFactory', TimeFactory)
    .factory('TimeFactoryTasks', TimeFactoryTasks)

  TimeController.$inject = ['$http', '$stateParams', 'TimeFactory', 'TimeFactoryTasks', 'config', 'logger', '$location', 'UserFactory']
  /* @ngInject */
  function TimeController ($http, $stateParams, TimeFactory, TimeFactoryTasks, config, logger, $location, UserFactory) {
    var vm = this
    vm.title = 'System'
    vm.time = {}
    vm.UserFactory = UserFactory
    activate()
    // http://localhost:3000/api/v1/time?where=date&gte=2015-11-17&lte=2015-12-25
    vm.create = function () {
      var time = new TimeFactory(vm.time)
      time.$save(function (response) {
        vm.time = {}
        vm.list()
      }, function (error) {
        console.log(arguments)
      })
    }

    vm.find = function () {
      TimeFactory.get({
        id: $stateParams.id
      }, function (success) {
        vm.time = success.data
      }, function (error) {
        console.log(arguments)
      })
    }
    vm.list = function () {
      TimeFactory.get(function (success) {
        vm.times = success.data
      }, function (error) {
        console.log(arguments)
      })
    }
    vm.update = function (isValid) {
      if (isValid) {
        TimeFactory.update({
          id: $stateParams.id
        }, vm.time,
          function (success) {
            $location.url('/time/view/' + $stateParams.id)
          },
          function (error) {
            console.log(arguments)
          })
      }
    }
    vm.delete = function (timeId) {
      var deleteConfirm = confirm('Are you sure you want to delete this time?')
      if (deleteConfirm === true) {
        TimeFactory.remove({
          id: timeId
        },
          function (success) {
            for (var i in vm.times) {
              if (vm.times[i]._id === timeId) {
                vm.times.splice(i, 1)
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
      logger.info('Activated Time View')
      TimeFactoryTasks.get({task: 'fields'}, function (success) {
        vm.fields = success.data
      }, function (error) {
        console.log(arguments)
      })

    }
  }

  TimeFactory.$inject = ['$resource']
  /* @ngInject */
  function TimeFactory ($resource) {
    return $resource('/api/v1/Time/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }
  TimeFactoryTasks.$inject = ['$resource']
  /* @ngInject */
  function TimeFactoryTasks ($resource) {
    return $resource('/api/v1/Time/task/:task', {
      tast: '@task'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }

})()
