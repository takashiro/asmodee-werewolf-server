
const enterroom = require('./enterroom');
const Room = require('../core/Room');

module.exports = function (input) {
	let room = enterroom.call(this, input);
	if (!(room instanceof Room)) {
		return room;
	}

	if (room.id <= 0) {
		return {error: 'ROOM_EXPIRED'};
	}

	let seat = parseInt(input.seat, 10);
	if (isNaN(seat) || !room.hasSeat(seat)) {
		return {error: 'INVALID_SEAT'};
	}

	let key = parseInt(input.key, 10);
	if (isNaN(key) || !key) {
		return {error: 'INVALID_SEATKEY'};
	}

	let card = room.takeSeat(seat, key);
	if (!card) {
		return {error: 'SEAT_TAKEN'};
	}

	return card;
};
