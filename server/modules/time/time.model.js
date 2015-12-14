var mongoose = require('mongoose')

var time = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  hours: {
    type: String,
    required: true,
    trim: true
  },
  project: {
    type: String,
    required: true,
    trim: true
  },
  group: {
    type: String,
    required: true,
    trim: true
  }
})

var Time = mongoose.model('Time', time)

module.exports = {
  Time: Time
}
