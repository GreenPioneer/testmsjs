;(function () {
  'use strict'

  angular
    .module('app.time', [])
    .controller('TimeController', TimeController)
    .factory('TimeFactory', TimeFactory)

  TimeController.$inject = ['$http', '$stateParams', 'TimeFactory', 'config', 'logger', '$location', 'UserFactory']
  /* @ngInject */
  function TimeController ($http, $stateParams, TimeFactory, config, logger, $location, UserFactory) {
    var vm = this
    vm.title = 'System'
    vm.time = {}
    vm.UserFactory = UserFactory
    activate()

    vm.create = function () {
      var time = new TimeFactory(vm.time)
      time.$save(function (response) {
        vm.time = response.data.data
        // window.location.href = 
        $location.url('/time/list')
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

})()
