'use strict';
//const router = require('express').Router();
//const db = require('../db');
const crypto = require('crypto');

// // let _registerRoutes = (routes, method) => {
// // 	for(let key in routes) {
// // 		if(typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
// // 			_registerRoutes(routes[key], key);
// // 		} else {
// // 		    //Register the routes
// // 			if(method === 'get') {
// // 				router.get(key, routes[key]);
// // 				} else if(method === 'post') {
// // 					router.post(key, routes[key]);
// // 				} else {
// // 					router.use(routes[key]);
// // 				}
// // 			}
// // 		}
// // 	}

// // let route = routes => {
// // 	_registerRoutes(routes);
// // 	return router;
// }	

let findOne = profileID => {
	return db.userModel.findOne({
		'profileId': profileID
	});
}

let createNewUser = (profile) => {
	return new Promise((resolve, reject) => {
		let newChatUser = new db.userModel({
			profileId: profile.id,
			fullName: profile.displayName,
			profilePic: profile.photos[0].value || ''
		});
		newChatUser.save(error => {
			if(error) {
				console.log('Error in creating a new user');
				reject(error);
			} else {
				resolve(newChatUser);
			}
		});
	});
}

let findById = id => {
	return new Promise((resolve, reject) => {
		db.userModel.findById(id, (error, user) => {
			if(error) {
				reject(error);
			} else {
				resolve(user);
			}
		})
	})
}

let isAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/');
	}
}

let findRoomByName = (allrooms, room) => {
	let findRoom = allrooms.findIndex((element, index, array) => {
		if(element.room === room ) {
			return true;
		} else {
			return false;
		}
		return findRoom > -1 ? true : false;

	});
}

let randomHex = () => {
	return crypto.randomBytes(24).toString('hex');
}

let findRoomByID = (allrooms, roomID) => {
	return allrooms.find((element, index, array) => {
		if(element.roomID === roomID) {
			return true;
		} else {
			return false;
		}
	})
}

let addUserToRoom = (allrooms, data, socket) => {
	let getRoom = findRoomByID(allrooms, data.roomID);
	if(getRoom !== undefined) {
		let userID = socket.request.session.passport.user;
		let checkUser = getRoom.users.findIndex((element, index, array) => {
			if(element.userID === userID) {
				return true;
			} else {
				return false;
			}
		});

		if(checkUser > -1) {
			getRoom.users.splice(checkUser, 1);
		}
		getRoom.users.push({
			socketID: socket.id,
			userID,
			user: data.user,
			userPic: data.userPic
		});

		socket.join(data.roomID);
	    return getRoom;
	}
}

let removeUserFromRoom = (allrooms, socket) => {
	for(let room of allrooms) {
		let findUser = room.users.findIndex((element, index, array) => {
			if(element.socketID === socket.id) {
				return true;
			} else {
				return false;
			}
		});
		if(findUser > -1) {
			socket.leave(room.roomID);
			room.users.splice(findUser, 1);
			return room;
		}
	}
}

module.exports = {
	findOne,
	createNewUser,
	findById,
	isAuthenticated,
	findRoomByName,
	randomHex,
	findRoomByID,
	addUserToRoom,
	removeUserFromRoom
}