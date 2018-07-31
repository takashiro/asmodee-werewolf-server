
const enterroom = require('./enterroom');
const Room = require('../core/Room');

module.exports = function (input) {
	let room = enterroom.call(this, input);
	if (!(room instanceof Room)) {
		return room;
	}

	if (room.ownerKey != input.ownerKey) {
		return {error: 'INVALID_OWNERKEY'};
	}

	let seats = [];
	for (let [seat, card] of room.seatMap) {
		seats.push({
			seat: seat,
			card: card.toJSON()
		});
	}
	return seats;
};
