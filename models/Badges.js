var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var badgeSchema = new mongoose.Schema({
  name: String,
  points: Number,
  points_required: Number,
  category: String,
  keys: [String]
}, schemaOptions);


var Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;