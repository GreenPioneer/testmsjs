var express = require('express')
var example = require('./example.controller.js')
var app = express()

app.get('/example/', example.example)
module.exports = app
