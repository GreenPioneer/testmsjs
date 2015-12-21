// var mongoose = require('mongoose')
// var Time = mongoose.model('Time')
var xlsx = require('node-xlsx')
var path = require('path')
var fs = require('fs')
var uuid = require('node-uuid')

exports.build = function (req, res) {
  var data = req.body.build || [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']]
  var buffer = xlsx.build([{name: 'Time Sheet', data: data}])
  var fileId = uuid.v4()
  var filePath = path.join(__dirname, '../../../client/uploads/' + fileId + '.xlsx')
  fs.writeFile(filePath, buffer, function (err) {
    if (err) {
      res.status(400).send(err)
    }
    // res.download(filePath)
    res.status(201).send({
      url: 'uploads/' + fileId + '.xlsx'
    })
  })
}
