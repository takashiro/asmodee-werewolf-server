
const Room = require('../core/Room');
const HttpException = require('../core/HttpException');

function POST(param, input) {
	if (!input.roles || !(input.roles instanceof Array)) {
		throw new HttpException(400, 'Invalid roles');
	}

	if (input.roles.length > 50) {
		throw new HttpException(400, 'Too many roles');
	}

	let roles = [];
	for (let role of input.roles) {
		role = parseInt(role, 10);
		if (!isNaN(role)) {
			roles.push(role);
		}
	}

	if (roles.length <= 0) {
		throw new HttpException(400, 'All roles are invalid');
	}

	let room = new Room;
	if (!this.roomManager.add(room)) {
		throw new HttpException(500, 'Too many rooms');
	}

	room.setRoles(roles);
	room.arrangeCards();

	let info = room.toJSON();
	info.ownerKey = room.ownerKey;
	return info;
};

function GET(param) {
	if (!param.id) {
		throw new HttpException(400, 'No room id');
	}

	let id = parseInt(param.id, 10);
	if (isNaN(id)) {
		throw new HttpException(400, 'Invalid room id');
	}

	let room = this.roomManager.get(id);
	if (!room) {
		throw new HttpException(404, 'The room does not exist');
	}

	return room;
};

function DELETE(param) {
	if (!param.id || !param.ownerKey) {
		throw new HttpException(400);
	}

	let roomId = parseInt(param.id, 10);
	if (isNaN(roomId) || roomId <= 0) {
		throw new HttpException(400);
	}

	let room = this.roomManager.get(roomId);
	if (!room || room.ownerKey !== param.ownerKey) {
		throw new HttpException(404);
	}

	this.roomManager.delete(room);
	return {id: room.id};
};

module.exports = {
	POST,
	GET,
	DELETE,
};
