
const getRoom = require('./room').GET;
const HttpException = require('../core/HttpException');

function GET(param) {
	let room = getRoom.call(this, param);

	if (room.id <= 0) {
		throw new HttpException(404);
	}

	let seat = parseInt(param.seat, 10);
	if (isNaN(seat) || !room.hasSeat(seat)) {
		throw new HttpException(400, 'Invalid seat');
	}

	let key = parseInt(param.key, 10);
	if (isNaN(key) || !key) {
		throw new HttpException(403, 'Invalid seat key');
	}

	let card = room.takeSeat(seat, key);
	if (!card) {
		throw new HttpException(409, 'The seat has been taken');
	}

	return card;
}

module.exports = {
	GET,
};
