var Post = require('../models/Post');
var User = require('../models/User');
var uuidV4 = require('uuid/v4');

//this handles both the view all posts '/forum' and the view specific post '/forum/:id' routes
//also redirects if the user is not logged into the website
exports.index = function(req, res){
	if(req.user){
		Post.find({active: true}, function(err, posts){
			if(posts){
				var sortedPosts = [];
				for (post in posts) {
					sortedPosts.push(posts[post]);
				}

				//sort by number of votes descending
				sortedPosts.sort(function(a, b){
    				return (b.votes.upvotes.length - b.votes.downvotes.length) - (a.votes.upvotes.length - a.votes.downvotes.length);
				});

				console.log('Unsorted posts: ' + posts);

				console.log();

				console.log('Sorted posts: ' + sortedPosts);

				return res.render('forum/allposts', {postObject: sortedPosts});
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
					{postTitle: post.postTitle, postBody: post.postBody, votes: post.votes, 
						docreation: post.docreation, PAGE_IDENTIFIER: post.uuid,
						userid: req.user._id.toString(), isOwner: (post._userid == req.user._id), 
						isUpvoter: post.votes.upvotes.indexOf(req.user._id.toString())>=0,
						isDownvoter: post.votes.downvotes.indexOf(req.user._id.toString())>=0,
						numVotes: (post.votes.upvotes.length - post.votes.downvotes.length),
						authorid: post._userid, CANON_URL: "http://localhost:3000"});
			}
			else {
				return res.render('error', 
					{errorCode: "This is an invalid post URL. Please verify the URL text and try again."});
			}
		});
	}
	else return res.redirect('/login');
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

	  	var newPost = new Post({
	  		postTitle: req.body.postTitle,
	  		postBody: req.body.postBody,
	  		active: true,
	  		_userid: req.user._id,
	  		uuid: uuidV4({ rng: uuidV4.nodeRNG }),
	  		votes: {upvotes: [], downvotes: []}
	  	});

	  	newPost.save(function(err){
	  		if(err) return res.render('error',
	  			{errorCode: "Something went wrong and we could not save your post. Please try again. " + err});
	  		res.redirect('/forum/' + newPost.uuid);
	  	});
	}
	else return res.render('error',
		{errorCode: "You must be signed in to interact with the DevConnect forum."});
}



exports.deletePost = function(req, res){
	if(req.user){
		Post.findOne({ uuid: req.params.postid, active: true }, function(err, post){
			if(err){
				req.flash('err', errors);
				console.log('Failed to mark post as inactive.');
			}
			else {
				post.active = false;
				post.save();
			}
			return res.redirect('/forum');
		})
	}

}

exports.upvotePost = function(req, res){
	var badgeCategory = "JavaDev";
	if(req.user){
		Post.findOne({ uuid: req.params.uuid, active: true }, function(err, post){
			if(!err){
				if(post.votes.upvotes.indexOf(req.user._id) == -1){
					post.votes.upvotes.push(req.user._id);
					post.votes.downvotes.pull(req.user._id);
					post.save();

					User.findOne( { _id: req.body.authorid, "badges.name" : badgeCategory}, 'badges', function (err, obj) {
	  					if (err) return handleError(err);

	  					var badge = (obj.badges).find(function (element) { return (element.name == badgeCategory)});

	  					if( badge.points < badge.points_required ){
							User.update( { _id: req.body.authorid, "badges.name" : badgeCategory }, 
				    		{$inc : {"badges.$.points" : 1} }, function(err, post){});
				    		console.log(badge);
	  					};
					});
				}
			}
			else {
				console.log('vote db error: ' + err);
			}
			return res.send('Votes: ' + (post.votes.upvotes.length - post.votes.downvotes.length).toString());
		});
	}
}

exports.downvotePost = function(req, res){
	var badgeCategory = "JavaDev";
	if(req.user){
		Post.findOne({ uuid: req.params.uuid, active: true}, function(err, post){
			if(!err){
				if(post.votes.downvotes.indexOf(req.user._id) == -1){
					post.votes.downvotes.push(req.user._id);
					post.votes.upvotes.pull(req.user._id);
					post.save();

					User.findOne( { _id: req.body.authorid, "badges.name" : badgeCategory}, 'badges', function (err, obj) {
	  					if (err) return handleError(err);

	  					var badge = (obj.badges).find(function (element) { return (element.name == badgeCategory)});

	  					if( badge.points > 0 ){
							User.update( { _id: req.body.authorid, "badges.name" : badgeCategory }, 
				    		{$inc : {"badges.$.points" : -1} }, function(err, post){});
				    		console.log(badge);
	  					};
					});
				}
			}
			else{
				console.log('downvote db error: ' + err);
			}
			return res.send('Votes: ' + (post.votes.upvotes.length - post.votes.downvotes.length).toString());
		});
	}
}









