
let nextRoomId = 0;

class Lobby {

	constructor(capacity = 1000)  {
		this.rooms = new Map;
		this.timeout = 60 * 60 * 1000;
		this.capacity = capacity;
	}

	/**
	 * The number of existing rooms
	 */
	get size() {
		return this.rooms.size;
	}

	/**
	 * Add a room
	 * @param {Room} room
	 * @return {boolean} whether the room is successfully added
	 */
	add(room) {
		if (this.rooms.size >= this.capacity) {
			return false;
		}

		nextRoomId++;
		if (nextRoomId > this.capacity) {
			nextRoomId = 1;
		}

		if (this.rooms.has(nextRoomId)) {
			return false;
		}

		room.id = nextRoomId;
		this.rooms.set(room.id, room);

		let id = room.id;
		let timer = setTimeout(() => {
			this.rooms.delete(id);
		}, this.timeout);
		room.setTimer(timer);

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

	/**
	 * Delete a room
	 * @return {boolean}
	 */
	delete(id) {
		const room = this.rooms.get(id);
		if (room) {
			room.destroy();
			return this.rooms.delete(id);
		} else {
			return false;
		}
	}

}

module.exports = Lobby;
