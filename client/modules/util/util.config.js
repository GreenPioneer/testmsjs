/* global angular:false toastr:false, moment:false */

;(function () {
  'use strict'

  var util = angular.module('app.util')
  util.config(interceptors)

  interceptors.$inject = ['$httpProvider']
  /* @ngInject */
  function interceptors ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor')
        $httpProvider.interceptors.push('noCacheInterceptor')
  }

})()

/*ngular.module('mean-factory-interceptor', [])
    .factory('httpInterceptor', ['$q', '$location',
        function($q, $location) {
            return {
                'response': function(response) {
                    if (response.status === 402) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    return response || $q.when(response);
                },

                'responseError': function(rejection) {

                    if (rejection.status === 402) {
                        $location.url('/login');
                        return $q.reject(rejection);
                    }
                    return $q.reject(rejection);
                }

            };
        }
    ]).factory('noCacheInterceptor', function() {
        return {
            request: function(config) {
                //console.log(config.method);
                var n = config.url.search(/template|modal|myModal|myCloseModal|myEmailModal/i);
                //console.log("search", n + ":"+ config.url);
                if (n == -1) {
                    if (config.method == 'GET') {
                        var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                        config.url = config.url + separator + 'noCache=' + new Date().getTime();
                    }
                    //console.log(config.method);
                    //console.log(config.url);
                } else {
                    //console.log("console noCache");
                }

                return config;
            }
        };
    })
//Http Interceptor to check auth failures for xhr requests
.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.interceptors.push('noCacheInterceptor');
    }
]);*/