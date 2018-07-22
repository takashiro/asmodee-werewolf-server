
class RoomManager {

	constructor()  {
		this.rooms = new Map;
		this.timeout = 60 * 60 * 1000;
	}

	/**
	 * Add a room
	 * @param {Room} room
	 * @return {boolean} whether the room is successfully added
	 */
	add(room) {
		let id = this._generateId();
		if (id <= 0) {
			return false;
		}

		room.id = id;
		this.rooms.set(id, room);

		setTimeout(() => {
			this.rooms.delete(id);
		}, this.timeout);

		return true;
	}

	/**
	 * Judge if a room exists
	 * @return {boolean}
	 */
	has(id) {
		return this.rooms.has(id);
	}

	/**
	 * get a room
	 * @return {Room}
	 */
	get(id) {
		return this.rooms.get(id);
	}

	_generateId() {
		let i = 0;
		do {
			let id = Math.floor(Math.random() * 10000);
			if (!this.rooms.has(id)) {
				return id;
			}
		} while (i < 5);
		return 0;
	}

}

module.exports = RoomManager;
