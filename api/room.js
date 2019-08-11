
const Room = require('../core/Room');
const HttpError = require('../core/HttpError');
const RoleCard = require('../game/RoleCard');
const GameMode = require('../game/Mode');

function POST(param, input) {
	if (!input.roles || !(input.roles instanceof Array)) {
		throw new HttpError(400, 'Invalid roles');
	}

	if (input.roles.length > 50) {
		throw new HttpError(400, 'Too many roles');
	} else if (input.roles.length <= 0) {
		throw new HttpError(400, 'At least one role must exist');
	}

	let roles = [];
	for (let role of input.roles) {
		if (RoleCard.isValid(role)) {
			roles.push(role);
		}
	}

	if (roles.length <= 0) {
		throw new HttpError(400, 'All roles are invalid');
	}

	let mode = (input.mode && parseInt(input.mode, 10)) || GameMode.Normal;
	if (!Object.values(GameMode).includes(mode)) {
		throw new HttpError(400, 'Bad game mode');
	}

	if (mode === GameMode.Dual && roles.length < 2) {
		throw new HttpError(400, 'Too few roles');
	}

	let room = new Room;
	if (!this.lobby.add(room)) {
		throw new HttpError(500, 'Too many rooms');
	}

	let engine = room.getEngine();
	engine.setMode(mode);
	engine.setRoles(roles);
	engine.start();

	let info = room.toJSON();
	info.ownerKey = room.ownerKey;
	return info;
}

function GET(param) {
	if (!param.id) {
		throw new HttpError(400, 'No room id');
	}

	let id = parseInt(param.id, 10);
	if (isNaN(id)) {
		throw new HttpError(400, 'Invalid room id');
	}

	let room = this.lobby.get(id);
	if (!room) {
		throw new HttpError(404, 'The room does not exist');
	}

	return room;
}

function DELETE(param) {
	if (!param.id || !param.ownerKey) {
		throw new HttpError(400);
	}

	let roomId = parseInt(param.id, 10);
	if (isNaN(roomId) || roomId <= 0) {
		throw new HttpError(400);
	}

	let room = this.lobby.get(roomId);
	if (!room || room.ownerKey !== param.ownerKey) {
		throw new HttpError(404, 'The room does not exist');
	}

	this.lobby.delete(room.id);
	return {id: room.id};
}

module.exports = {
	POST,
	GET,
	DELETE,
};
