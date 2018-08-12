
module.exports = function (input) {
	if (!input.id || !input.ownerKey) {
		return 400;
	}

	let roomId = parseInt(input.id, 10);
	if (isNaN(roomId) || roomId <= 0) {
		return 400;
	}

	let room = this.roomManager.get(roomId);
	if (!room || room.ownerKey !== input.ownerKey) {
		return 404;
	}

	this.roomManager.delete(room);
	return {id: room.id};
};
