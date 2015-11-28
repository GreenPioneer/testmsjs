'use strict'

var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..')
module.exports = {
  root: rootPath,
  http: {
    port: process.env.PORT || 3000
  },
  hostname: process.env.HOST || process.env.HOSTNAME,
  db: process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/blog',
  templateEngine: 'swig',

  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  sessionSecret: 'MEANSTACKJS',

  // The name of the MongoDB collection to store sessions in
  sessionCollection: 'sessions',

  // The session cookie settings
  sessionCookie: {
    path: '/',
    httpOnly: true,
    // If secure is set to true then it will cause the cookie to be set
    // only when SSL-enabled (HTTPS) is used, and otherwise it won't
    // set a cookie. 'true' is recommended yet it requires the above
    // mentioned pre-requisite.
    secure: false,
    // Only set the maxAge to null if the cookie shouldn't be expired
    // at all. The cookie will expunge when the browser is closed.
    maxAge: null
  },

  // The session cookie name
  sessionName: 'connect.meanstackjs',
  title: 'MEANSTACKJS',

  assets: {
    js: ['https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min.js', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.5/angular-resource.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.min.js', 'https://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.14.3.min.js',
      '/client.module.js', '/system/system.module.js', '/exception/exception.module.js', '/logger/logger.module.js', '/router/router.module.js', '/layout/layout.module.js', '/layout/layout.controller.js',
      '/exception/exception-handler.provider.js', '/exception/exception.js', '/logger/logger.js', '/router/router-helper.provider.js',
      '/system/system.controller.js', '/system/system.routes.js'],
    css: ['https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css']
  },
  buildreq: {
    response: {
      method: 'get',
      data: {},
      user: {},
      count: 0,
      hostname: '',
      type: '',
      actions: {
        prev: false,
        next: false
      },
      delete: ['error', 'user']
    },
    query: {
      sort: '',
      limit: 10,
      select: '',
      filter: {},
      populateId: '',
      populateItems: '',
      lean: false,
      skip: 0,
      where: '',
      gt: 1,
      lt: 0,
      in: [],
      equal: '',
      errorMessage: 'Unknown Value'
    },
    routing: {
      schema: true,
      url: '/api/v1/'
    }
  }
}
