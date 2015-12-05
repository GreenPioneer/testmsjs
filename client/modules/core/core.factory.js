;(function () {
  'use strict'

  angular
    .module('app.core')
    .factory('UserFactory', UserFactory)

  UserFactory.$inject = [ '$rootScope', '$http', '$location', '$stateParams', '$cookies', '$q', '$timeout']

  /* @ngInject */
  function UserFactory ($rootScope, $http, $location, $stateParams, $cookies, $q, $timeout) {
    var self
    var UserFactory = new UserClass()
    function escape (html) {
      return String(html)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    function b64_to_utf8 (str) {
      return decodeURIComponent(escape(window.atob(str)))
    }

    /*function url_base64_decode(str) {
      var output = str.replace('-', '+').replace('_', '/')
      switch (output.length % 4) {
      case 0:
      break
      case 2:
      output += '=='
      break
      case 3:
      output += '='
      break
      default:
      throw 'Illegal base64url string!'
      }
      return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
    }*/

    function UserClass () {
      this.name = 'users'
      this.user = {}
      this.registerForm = false
      this.loggedin = false
      this.isAdmin = false
      this.loginError = 0
      this.usernameError = null
      this.registerError = null
      this.resetpassworderror = null
      this.validationError = null
      self = this
      $http.get('/api/login').success(function (response) {
        if (!response && $cookies.get('token') && $cookies.get('redirect')) {
          self.onIdentity.bind(self)({
            token: $cookies.get('token'),
            redirect: $cookies.get('redirect').replace(/^"|"$/g, '')
          })
          $cookies.remove('token')
          $cookies.remove('redirect')
        } else {
          self.onIdentity.bind(self)(response)
        }
      })
    }

    UserClass.prototype.onIdentity = function (response) {
      if (!response) return
      var encodedUser, user, destination
      if (angular.isDefined(response.token)) {
        localStorage.setItem('JWT', response.token)
        encodedUser = decodeURI(b64_to_utf8(response.token.split('.')[1]))
        user = JSON.parse(encodedUser)
      }
      destination = angular.isDefined(response.redirect) ? response.redirect : destination
      this.user = user || response
      this.loggedin = true
      this.loginError = 0
      this.registerError = 0
      // this.isAdmin = this.user.roles.indexOf('admin') > -1
      var self = this
    }

    UserClass.prototype.onIdFail = function (response) {
      $location.path(response.redirect)
      this.loginError = 'Authentication failed.'
      this.registerError = response
      this.validationError = response.msg
      this.resetpassworderror = response.msg
      $rootScope.$emit('loginfailed')
      $rootScope.$emit('registerfailed')
    }
    UserClass.prototype.editProfile = function (vm) {
      var deferred = $q.defer()

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/login').then(function (success) {
        // Authenticated
        if (success.data !== '0') {
          console.log(success.data)
          vm.editProfile = success.data
          $timeout(deferred.resolve)
        } else { // Not Authenticated
          $cookies.put('redirect', $location.path())
          $timeout(deferred.reject)
          $location.url('/auth/login')
          vm.logger.error('Not Authenticated', success, 'Login')
        }
      }, function (error) {
        console.log(error)
      })

      return deferred.promise
    }
    UserClass.prototype.login = function (vm) {
      // this is an ugly hack due to mean-admin needs
      // redirect: destination
      $http.post('/api/login', {
        email: vm.loginCred.email,
        password: vm.loginCred.password
      }).then(
        function (success) {
          window.location.href = '/'
          vm.loginCred = {}
        },
        function (error) {
          vm.logger.error(error.data, error, 'Login')
        })
        // $http.post('/api/login', {
        //   email: user.email,
        //   password: user.password,

    // })
    //   .success(this.onIdentity.bind(this))
    //   .error(this.onIdFail.bind(this))
    }
    UserClass.prototype.update = function (vm) {
      $http.post('/api/account/profile', vm.editProfile)
        .then(
          function (success) {
            vm.logger.success(vm.editProfile.profile.name + ' your profile has be saved', vm.editProfile, 'Updated Profile')
            // window.location.reload()

          },
          function (error) {
            vm.logger.error(error.data, error, 'Login')
          })
    }
    UserClass.prototype.signup = function (vm) {
      if (vm.loginCred.password === vm.loginCred.confirmPassword) {
        $http.post('/api/signup', vm.loginCred)
          .then(
            function (success) {
              window.location.href = '/'
              vm.loginCred = {}
            },
            function (error) {
              vm.logger.error(error.data, error, 'Login')
            })
      }
    // $http.post('/api/register', {
    //   email: user.email,
    //   password: user.password,
    //   confirmPassword: user.confirmPassword,
    //   username: user.username,
    //   name: user.name
    // })
    //   .success(this.onIdentity.bind(this))
    //   .error(this.onIdFail.bind(this))
    }

    UserClass.prototype.resetpassword = function (user) {
      $http.post('/api/reset/' + $stateParams.tokenId, {
        password: user.password,
        confirmPassword: user.confirmPassword
      })
        .success(this.onIdentity.bind(this))
        .error(this.onIdFail.bind(this))
    }

    UserClass.prototype.forgotpassword = function (user) {
      $http.post('/api/forgot-password', {
        text: user.email
      })
        .success(function (response) {
          $rootScope.$emit('forgotmailsent', response)
        })
        .error(this.onIdFail.bind(this))
    }

    UserClass.prototype.logout = function (vm) {
      $http.get('/api/logout').success(function (data) {
        localStorage.removeItem('JWT')
        $rootScope.$emit('logout')
        vm.UserFactory = {}
      })
      // this.user = {}
      // this.loggedin = false
      // this.isAdmin = false

    // $http.get('/api/logout').success(function (data) {
    //   localStorage.removeItem('JWT')
    //   $rootScope.$emit('logout')
    // })
    }

    UserClass.prototype.checkLoggedin = function () {
      var deferred = $q.defer()

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function (user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve)

        // Not Authenticated
        else {
          $cookies.put('redirect', $location.path())
          $timeout(deferred.reject)
          $location.url('/auth/login')
        }
      })

      return deferred.promise
    }

    UserClass.prototype.checkLoggedOut = function () {
      // Check if the user is not connected
      // Initialize a new promise
      var deferred = $q.defer()

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function (user) {
        // Authenticated
        if (user !== '0') {
          $timeout(deferred.reject)
          $location.url('/')
        }
        // Not Authenticated
        else $timeout(deferred.resolve)
      })

      return deferred.promise
    }

    UserClass.prototype.checkAdmin = function () {
      var deferred = $q.defer()

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function (user) {
        // Authenticated
        if (user !== '0' && user.roles.indexOf('admin') !== -1) $timeout(deferred.resolve)

        // Not Authenticated or not Admin
        else {
          $timeout(deferred.reject)
          $location.url('/')
        }
      })

      return deferred.promise
    }

    return UserFactory

  }
}())
