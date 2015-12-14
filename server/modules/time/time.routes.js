var _ = require('lodash')
var express = require('express')
var chalk = require('chalk')

var time = require('./time.controller.js')
var app = express()

app.post('/time/build/', time.build)
module.exports = app
