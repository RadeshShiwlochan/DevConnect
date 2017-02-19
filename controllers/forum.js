var Post = require('../models/Post');

//this handles both the view all posts '/forum' and the view specific post '/forum/:id' routes
//also redirects if the user is not logged into the website
exports.index = function(req, res){
	if(req.user){
		Post.find({active: true}, function(err, posts){
			if(posts){
				return res.render('forum/allposts', {postObject: posts});
			}
			else return res.render('forum/allposts', {postObject: "\"\""});
		})
	}
	else {
		return res.redirect('/login');
	}
};

exports.viewPost = function(req, res){
	if(req.user){
		Post.findOne({ guid: req.params.guid, active: true}, function(err, post){
			if(post){
				return res.render('forum/viewpost',
					{title: post.title, body: post.body, docreation: post.docreation});
			}
			else {
				return res.render('error', 
					{errorCode: "This is an invalid post URL. Please verify the URL text and try again."});
			}
		});
	}
};