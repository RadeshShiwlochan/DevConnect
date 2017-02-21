'use strict';
const Post = require('../models/Post');
const uuidV4 = require('uuid/v4');

exports.recoverPosts = () => {
	let sortedActvePost = Post.find({active: true}).sort({'postTitle':-1});
	return  sortedActvePost;
}

