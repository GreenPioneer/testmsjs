var mongoose = require('mongoose')

var exampleSchema = mongoose.Schema({
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  }
})

var Example = mongoose.model('Example', exampleSchema)
module.exports = {
  Example: Example
}
