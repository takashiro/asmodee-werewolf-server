
const HttpError = require('../core/HttpError');
const Timing = require('../game/Timing');

const getRoom = require('./room').GET;

function GET(param) {
	let room = getRoom.call(this, param);

	if (room.ownerKey != param.ownerKey) {
		throw new HttpError(403, 'Invalid owner key');
	}

	const engine = room.getEngine();
	const seats = [];
	for (let player of engine.players) {
		let card = {role: player.getRole().toNum()};
		engine.trigger(Timing.TakeSeat, player, card);
		seats.push({
			seat: player.getSeat(),
			card,
		});
	}
	return seats;
}

module.exports = {
	GET,
};
