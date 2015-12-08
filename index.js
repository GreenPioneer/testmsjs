/**
 * Module dependencies.
 */
var settings = require('./configs/settings.js')
var express = require('express')
var cookieParser = require('cookie-parser')
var compress = require('compression')
var favicon = require('serve-favicon')
var session = require('express-session')
var bodyParser = require('body-parser')
var logger = require('morgan')
var errorHandler = require('errorhandler')
var lusca = require('lusca')
var methodOverride = require('method-override')

var _ = require('lodash')
var MongoStore = require('connect-mongo')(session)
var flash = require('express-flash')
var path = require('path')
var mongoose = require('mongoose')
var passport = require('passport')
var expressValidator = require('express-validator')
var sass = require('node-sass-middleware')

// var serveStatic = require('serve-static')
// var helmet = require('helmet')
// var compression = require('compression')
// well-known web vulnerabilities
//  apps[n].use(helmet())
// Gzip compressing
//  apps[n].use(compression())
/**
 * Create Express server.
 */
var app = express()
/**
 * Aggregation & dynamic api building
 */
var Register = require('./server/register.js')(app)
var build = require('buildreq')(settings.buildreq)

/**
 * Connect to MongoDB.
 */
//  mongoose.connect('mongodb://localhost/mean-dev', {server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }}})
// var db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', function callback () {
//   // console.log("connection")
// })
mongoose.connect(settings.db)
mongoose.connection.on('error', function () {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.')
  process.exit(1)
})

/**
 * Swig configuration.
 */
var swig = require('swig')
app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', __dirname + '/client')

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000)
app.use(compress())
// app.use(sass({
//   src: path.join(__dirname, 'client'),
//   dest: path.join(__dirname, 'client'),
//   debug: true,
//   outputStyle: 'expanded'
// }))
app.use(logger('dev'))
// app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(methodOverride())
app.use(cookieParser())
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'meanstackjs',
  store: new MongoStore({ url: settings.db, autoReconnect: true })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
// app.use(lusca({
//   csrf: {key: 'x-xsrf-token', header: '_csrf'},
//   xframe: 'SAMEORIGIN',
//   csp: false,
//   p3p: false,
//   hsts: false,
//   xssProtection: true
// }))
app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})
app.use(function (req, res, next) {
  if (/api/i.test(req.path)) {
    try {
      if (req.body.redirect) {
        console.log(req.body)
        req.session.returnTo = req.body.redirect
      }
    } catch(err) {
      console.log(err)
    }
  }
  next()
})

/**
 * Dynamic Query Builder
 */
app.use(build.query())
/**
 * Manual Routes
 */
Register.all(settings)
/**
 * Dynamic Routes / Manully enabling them . You can change it back to automatic in the settings
 * build.routing(app, mongoose) - if reverting back to automatic
 */
_.forEach(build.routing(app, mongoose), function (m) {
  app.use(m.route, m.app)
})

/**
 * Make Client Folder Public
 */
app.use(express.static(path.join(__dirname, 'client/'), { maxAge: 31557600000 }))

/**
 * Primary app routes.
 */

app.get('/*', function (req, res) {
  if (_.isUndefined(req.user)) {
    req.user = {}
    req.user.authenticated = false
  } else {
    req.user.authenticated = true
  }
  res.render(path.resolve('server') + '/layout/index.html', {
    title: settings.title,
    assets: app.locals.frontendFilesFinal,
    user: req.user
  })
})
/**
 * Error Handler.
 */
app.use(errorHandler())

/**
 * Socketio Realtime
 */
// var server = require('http').createServer(app)
// var io = require('socket.io')(server)
// io.on('connection', function(){ /* … */ })
// server.listen(3000)
/**
 * Swagger
 */
// var swaggerpath = express()
// app.use('/swagger', swaggerpath)
// var swagger = require('swagger-node-express')
// swagger.createNew(swaggerpath)

/**
 * Start Express server.
 */
app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'))
})
module.exports = app
