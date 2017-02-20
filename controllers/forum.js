var Post = require('../models/Post');
var uuidV4 = require('uuid/v4');

//this handles both the view all posts '/forum' and the view specific post '/forum/:id' routes
//also redirects if the user is not logged into the website
exports.index = function(req, res){
	if(req.user){
		Post.find({active: true}, function(err, posts){
			if(posts){
				return res.render('forum/allposts', {postObject: posts});
			}
			else return res.render('forum/allposts');
		})
	}
	else {
		return res.redirect('/login');
	}
};

exports.viewPost = function(req, res){
	if(req.user){
		Post.findOne({ uuid: req.params.uuid, active: true}, function(err, post){
			if(post){
				return res.render('forum/viewpost',
					{postTitle: post.postTitle, postBody: post.postBody, docreation: post.docreation, 
						PAGE_IDENTIFIER: post.uuid, CANON_URL: "http://localhost:3000"});
			}
			else {
				return res.render('error', 
					{errorCode: "This is an invalid post URL. Please verify the URL text and try again."});
			}
		});
	}
};

exports.createPost = function(req, res){
	if(req.user){
		req.assert('postTitle', 'Title cannot be blank.').notEmpty();
		req.assert('postBody', 'Body cannot be blank.').notEmpty();

		var errors = req.validationErrors();
		if (errors) {
		    req.flash('error', errors);
	  	}

	  	console.log('Errors gate passed.');

	  	//TODO: convert whitespaces to respective chars in req.body.postBody (\n\t...)
	  	var newPost = new Post({
	  		postTitle: req.body.postTitle,
	  		postBody: req.body.postBody,
	  		active: true,
	  		_userid: req.user._id,
	  		uuid: uuidV4({ rng: uuidV4.nodeRNG })
	  	});

	  	newPost.save(function(err){
	  		if(err) return res.render('error',
	  			{errorCode: "Something went wrong and we could not save your post. Please try again. " + err});
	  		res.redirect('/forum/' + newPost.uuid);
	  	});

	  	console.log('Post save complete');
	}
	else return res.render('error',
		{errorCode: "You must be signed in to interact with the DevConnect forum."});
}