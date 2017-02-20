'use strict';

if(process.env.NODE_ENV === 'production') {
	//offer production stage environment variables
	module.export = {
		host: process.env.host || "",
		dbURI: process.env.dbURI,
		sessionSecret: process.env.sessionSecret,
		fb: {
			clientID: process.env.fbClientID,
			clientSecret:process.env.fbClientSecret,
			callbackURL: process.env.host + "/auth/facebook/callback",
			profileFields: ['id', 'displayName', 'photos']
		},
		twitter: {
			consumerKey: process.env.twConsumerKey,
			consumerSecret: process.env.twConsumerSecret,
			callbackURL: process.env.host + "/auth/twitter/callback",
			profileFields: ['id', 'displayName', 'photos']
		}
	}

} else {
	//offer dev stage settings and data
	module.exports = require('./development.json');
  }

//didnt set the callback url on facebook , lectrure 49