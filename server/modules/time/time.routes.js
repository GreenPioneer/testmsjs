var express = require('express')
var time = require('./time.controller.js')
var app = express()

app.post('/time/build/', time.build)
module.exports = app
