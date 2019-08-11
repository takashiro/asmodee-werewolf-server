
const getRoom = require('./room').GET;
const HttpError = require('../core/HttpError');

function GET(param) {
	let room = getRoom.call(this, param);

	if (room.id <= 0) {
		throw new HttpError(404, 'Room does not exist');
	}

	let engine = room.getEngine();
	let seat = parseInt(param.seat, 10);
	if (isNaN(seat) || !engine.hasSeat(seat)) {
		throw new HttpError(400, 'Invalid seat');
	}

	let key = parseInt(param.key, 10);
	if (isNaN(key) || !key) {
		throw new HttpError(403, 'Invalid seat key');
	}

	let profile = engine.takeSeat(seat, key);
	if (!profile) {
		throw new HttpError(409, 'The seat has been taken');
	}

	return profile;
}

module.exports = {
	GET,
};
