
let nextRoomId = 0;

class RoomManager {

	constructor(capacity = 1000)  {
		this.rooms = new Map;
		this.timeout = 60 * 60 * 1000;
		this.capacity = capacity;
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

		room.id = nextRoomId;
		this.rooms.set(room.id, room);

		let id = room.id;
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

	/**
	 * Delete a room
	 */
	delete(id) {
		return this.rooms.delete(id);
	}

}

module.exports = RoomManager;
