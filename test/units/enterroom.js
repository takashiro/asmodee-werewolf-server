
const assert = require('assert');
const UnitTest = require('../UnitTest');

class EnterRoomTest extends UnitTest {

	constructor() {
		super('Enter a room');
	}

	async run() {
		let roles = [1, 2, 3, 4, 5];
		await this.post('room', {roles});
		let created_room = await this.getJSON();

		await this.get('room', {id: created_room.id});
		let room = await this.getJSON();
		assert(room.id === created_room.id);
		assert(!room.ownerKey);
		assert(room.salt === created_room.salt);
		assert(room.roles.length === created_room.roles.length);
		for (let i = 0; i < room.roles.length; i++) {
			assert(room.roles[i] === created_room.roles[i]);
		}

		await this.delete('room', {id: created_room.id, ownerKey: created_room.ownerKey});
		await this.assertJSON({id: created_room.id});
	}

}

module.exports = EnterRoomTest;
