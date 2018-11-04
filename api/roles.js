
const getRoom = require('./room').GET;
const HttpException = require('../core/HttpException');

function GET(param) {
	let room = getRoom.call(this, param);

	if (room.ownerKey != param.ownerKey) {
		throw new HttpException(403, 'Invalid owner key');
	}

	let seats = [];
	for (let [seat, card] of room.seatMap) {
		seats.push({
			seat: seat,
			card: card.toJSON()
		});
	}
	return seats;
}

module.exports = {
	GET,
};
