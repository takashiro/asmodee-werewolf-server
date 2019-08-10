
const HttpError = require('../core/HttpError');
const Timing = require('../game/Timing');

const getRoom = require('./room').GET;

function GET(param) {
	let room = getRoom.call(this, param);

	if (room.ownerKey != param.ownerKey) {
		throw new HttpError(403, 'Invalid owner key');
	}

	const engine = room.getEngine();
	const profiles = [];
	for (const player of engine.players) {
		const profile = player.getProfile();
		engine.trigger(Timing.TakeSeat, player, profile);
		profiles.push(profile);
	}
	return profiles;
}

module.exports = {
	GET,
};
