var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	guid: {type: String, unique: true},
	_userid: String, //the document ID for the current user in req.user._id (guaranteed not null since user must be
	//signed in to get here

	//TO-DO: Add attributes for a new post here, and configure a webpage for both post creation and viewing:
	title: String,
	body: String,
	docreation: Date, //date of creation
	active: Boolean //determines whether or not to display this post
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;