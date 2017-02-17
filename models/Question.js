var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }

};
var questionSchema = new mongoose.Schema({
	question: String,
	author_id: String, //user doc id of user that created this question
	answer_id: String //comment document id that answers this question (null if not answered)
}, schemaOptions);

var User = mongoose.model('User', userSchema);

module.exports = User;