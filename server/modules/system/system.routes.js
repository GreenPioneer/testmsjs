var _ = require('lodash')
var express = require('express')
var chalk = require('chalk')

var system = require('./system.controller.js')
var app = express()

app.get('/testing/', system.testing)
module.exports = app
