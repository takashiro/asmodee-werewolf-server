
const Room = require('../core/Room');

module.exports = function (input) {
	if (!input.roles || !(input.roles instanceof Array)) {
		return 400;
	}

	if (input.roles.length > 50) {
		return 400;
	}

	let roles = [];
	for (let role of input.roles) {
		role = parseInt(role, 10);
		if (!isNaN(role)) {
			roles.push(role);
		}
	}

	if (roles.length <= 0) {
		return 400;
	}

	let room = new Room;
	if (!this.roomManager.add(room)) {
		return 400;
	}

	room.setRoles(roles);
	room.arrangeCards();

	let info = room.toJSON();
	info.ownerKey = room.ownerKey;
	return info;
};
