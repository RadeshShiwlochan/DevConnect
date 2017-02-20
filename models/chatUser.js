'use strict';
const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);
const logger = require('../logger');

//Log an error if the connection fails
Mongoose.connection.on('error', error => {
	logger.log('error', 'Mongoose connect error: ' + error);
});

//create a Schema that defines the structure for storing user data

const chatUser = new Mongoose.Schema({
	profileId: String,
	fullName: String,
	profilePic:String
});

//turn the schema into a usable model
//changed here 'chatUser', chatUser 
let userModel = Mongoose.model('chatuser', chatUser);

module.exports = {
	Mongoose,
	userModel
}