var mongoose = require('mongoose')
var Blog = mongoose.model('Blog')

exports.testing = function (req, res) {
  Blog.find({}).exec(
    function (err, data) {
      if (err) {
        return res.status(400).send(err)
      }
      return res.status(200).send({
        query: req.queryParameters,
        data: data
      })
    })
}
