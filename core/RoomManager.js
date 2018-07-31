
let nextRoomId = 0;

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
		nextRoomId++;
		room.id = nextRoomId;
		this.rooms.set(room.id, room);

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

}

module.exports = RoomManager;
