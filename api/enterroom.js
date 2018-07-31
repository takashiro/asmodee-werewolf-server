
module.exports = function (input) {
	if (!input.id) {
		return 400;
	}

	let id = parseInt(input.id, 10);
	if (isNaN(id)) {
		return 400;
	}

	let room = this.roomManager.get(id);
	if (!room) {
		return {id : 0};
	}

	return room;
};
