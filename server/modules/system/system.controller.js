var mongoose = require('mongoose')
Blog = mongoose.model('Blog')

exports.testing = function (req, res) {
  Blog.find({}).exec(function (err, data) {
    res.status(200).send({query: req.queryParameters,data: data})
  })
}
