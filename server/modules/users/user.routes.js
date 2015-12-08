var _ = require('lodash')
var express = require('express')
var chalk = require('chalk')
var passportConf = require('./passport.controller.js')
var user = require('./user.controller.js')

var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var fs = require('fs')
var path = require('path')
var multer = require('multer')

var app = express()
app.use(bodyParser.json())
app.use(methodOverride())

var upload = multer({ dest: 'client/uploads/' })
app.post('/photos/upload', upload.single('file'), function (req, res, next) {
  if (req.file) {
    var filePath = path.resolve(__dirname, '../../../client/uploads/')
    fs.readFile(req.file.path, function (err, data) {
      var createDir = filePath + '/' + req.file.originalname
      fs.writeFile(createDir, data, function (err) {
        if (err) {
          res.status(400).send(err)
        } else {
          res.status(201).send()
        }
      })
    })
  }
})

app.get('/login', user.getLogin)
app.post('/login', user.postLogin)
app.get('/logout', user.logout)
app.get('/forgot', user.getForgot)
app.post('/forgot', user.postForgot)
app.get('/reset/:token', user.getReset)
app.post('/reset/:token', user.postReset)
app.get('/signup', user.getSignup)
app.post('/signup', user.postSignup)
app.get('/account', passportConf.isAuthenticated, user.getAccount)
app.post('/account/profile', passportConf.isAuthenticated, user.postUpdateProfile)
app.post('/account/password', passportConf.isAuthenticated, user.postUpdatePassword)
app.post('/account/delete', passportConf.isAuthenticated, user.postDeleteAccount)
app.get('/account/unlink/:provider', passportConf.isAuthenticated, user.getOauthUnlink)

module.exports = app
