var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	uuid: {type: String, unique: true},
	_userid: String, //the document ID for the current user in req.user._id (guaranteed not null since user must be
	//signed in to get here
	postTitle: String,
	postBody: String,
	docreation: Date, //date of creation
	active: Boolean, //determines whether or not to display this post
	_answerid: String,
	votes: {upvotes: [String], downvotes: [String]}
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;