const config = require('../config');
const h = require('../helpers');

exports.index = function(req, res) {
	let getRoom = h.findRoomByID(req.app.locals.chatrooms, req.params.id);
	if(getRoom === undefined) {
		return next();
	} else {
		res.render('chatroom', {
			user: req.user,
			host: config.host,
			room: getRoom.room,
			roomID: getRoom.roomID
		});
	}	
  res.render('Chatroom', {
  	host: config.host
  });
};