var mongoose = require('mongoose')

var blogSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    trim: true
  }
})

var Blog = mongoose.model('Blog', blogSchema)

module.exports = {
  Blog: Blog
}
