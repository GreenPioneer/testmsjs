;(function () {
  'use strict'

  angular
    .module('app.core')
    .factory('UserFactory', UserFactory)

  UserFactory.$inject = [ '$rootScope', '$http', '$location', '$stateParams', '$cookies', '$q', '$timeout', 'logger']

  /* @ngInject */
  function UserFactory ($rootScope, $http, $location, $stateParams, $cookies, $q, $timeout, logger) {
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
      if (!response) return ({error: true})
      var encodedUser, user, destination
      // if (angular.isDefined(response.user.token)) {
      //   localStorage.setItem('JWT', response.user.token)
      //   encodedUser = decodeURI(b64_to_utf8(response.user.token.split('.')[1]))
      //   user = JSON.parse(encodedUser)
      // }
      destination = angular.isDefined(response.redirect || response.data) ? response.redirect || response.data.redirect : false
      console.log(response)
      this.user = user || response.user || response.data.user
      this.loggedin = response.authenticated || response.data.authenticated
      this.loginError = 0
      this.registerError = 0
      // this.isAdmin = this.user.roles.indexOf('admin') > -1
      var self = this
      $rootScope.$emit('loggedin')
      if (destination) {
        $location.path(destination)
      }
      return ({
        error: false
      })
    }

    UserClass.prototype.onIdFail = function (error) {
      logger.error(error.data, error, 'Login')
      return ({
        error: true
      })
      // $location.path(response.redirect)
      this.loginError = 'Authentication failed.'
      this.registerError = response
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
          $location.url('/login')
          logger.error('Not Authenticated', success, 'Login')
        }
      }, function (error) {
        console.log(error)
      })

      return deferred.promise
    }
    UserClass.prototype.login = function (vm) {
      $http.post('/api/login', {
        email: vm.loginCred.email,
        password: vm.loginCred.password,
        redirect: '/'
      }).then(
        this.onIdentity.bind(this),
        this.onIdFail.bind(this)
      ).then(function (response) {
        if (!response.error) {
          logger.success(vm.loginCred.email, vm.loginCred, ' successfully logged in')
        }
      })
    }
    UserClass.prototype.updateProfile = function (response) {
      logger.success(response.data.profile.name + ' your profile has be saved', response.data, 'Updated Profile')
      this.user = response.data
      $rootScope.$emit('profileUpdated')
    }
    UserClass.prototype.error = function (error) {
      logger.error(error.data, error, 'User Error')
    }
    UserClass.prototype.update = function (vm) {
      $http.post('/api/account/profile', vm.editProfile)
        .then(this.updateProfile.bind(this), this.error.bind(this))
    // logger.error(error.data, error, 'Login')
    }
    UserClass.prototype.signup = function (vm) {
      if (vm.loginCred.password === vm.loginCred.confirmPassword) {
        this.redirect = '/time/list'
        $http.post('/api/signup', vm.loginCred)
          .then(this.onIdentity.bind(this), this.onIdFail.bind(this))
          .then(function (response) {
            if (!response.error) {
              logger.success(vm.loginCred.name, vm.loginCred, ' successfully signed up')
              vm.loginCred = {}
            }
          })
      } else {
        logger.error(' passwords dont match', 'passwords dont match', 'Error')
      }
    }

    UserClass.prototype.resetpassword = function (data) {
      $http.post('/api/reset/' + $stateParams.tokenId, {
        password: data.user.password,
        confirmPassword: data.user.confirmPassword
      })
        .success(this.onIdentity.bind(this))
        .error(this.onIdFail.bind(this))
    }

    UserClass.prototype.forgotpassword = function (data) {
      $http.post('/api/forgot-password', {
        text: data.user.email
      })
        .success(function (response) {
          $rootScope.$emit('forgotmailsent', response)
        })
        .error(this.onIdFail.bind(this))
    }

    UserClass.prototype.logout = function (vm) {
      $http.get('/api/logout').success(function (data) {
        // localStorage.removeItem('JWT')
        $rootScope.$emit('logout')
        $location.url('/')
      // this.user = {}
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
      $http.get('/api/login').success(function (data) {
        // Authenticated
        if (data.authenticated !== false) {
          $timeout(deferred.resolve)

        }
        // Not Authenticated
        else {
          $cookies.put('redirect', $location.path())
          $timeout(deferred.reject)
          $location.url('/login')
          logger.error('please sign in', user, 'Unauthenticated')
        }
      })

      return deferred.promise
    }

    UserClass.prototype.checkLoggedOut = function () {
      // Check if the user is not connected
      // Initialize a new promise
      var deferred = $q.defer()

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/login').success(function (data) {
        // Authenticated
        if (data.authenticated !== false) {
          $timeout(deferred.reject)
          logger.error(data.user.profile.name + ' You are already signed in', user, 'Authenticated Already')
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
      $http.get('/api/login').success(function (data) {
        // Authenticated
        if (data.authenticated !== '0' && data.user.roles.indexOf('admin') !== -1) $timeout(deferred.resolve)

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
