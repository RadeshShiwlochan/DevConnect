'user strict';
const h = require('../helpers');

module.exports = (io, app) => {
	let allrooms = app.locals.chatrooms;

	

	io.of('/roomslist').on('connection', socket => {
		socket.on('getChatrooms', () => {
			socket.emit('chatRoomsList', JSON.stringify(allrooms));
		//});
	});	
		socket.on('createNewRoom', newRoomInput => {
	// 		//check if a room with that name already exist
	// 		//if it exist do not create a new one, else create one
			if(!h.findRoomByName(allrooms, newRoomInput)) {
				allrooms.push({
					room: newRoomInput,
					roomID: h.randomHex(),
					users: []
				});
				//Emit an updated lsit to the creator
				socket.emit('chatRoomsList', JSON.stringify(allrooms));
				socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
			}
		});
	});

	io.of('/chatter').on('connection', socket => {
		socket.on('join', data => {
			let usersList = h.addUserToRoom(allrooms, data, socket);
			socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
			socket.emit('updateUsersList', JSON.stringify(usersList.users));
		});

		//when a socket exits
		socket.on('disconnect', () => {
			let room = h.removeUserFromRoom(allrooms, socket);
			socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
		});

		//When a new message arrives
		socket.on('newMessage', data => {
			socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
		});

		
	});

}