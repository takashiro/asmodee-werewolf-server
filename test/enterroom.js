
const assert = require('assert');
const UnitTest = require('../UnitTest');

class EnterRoomTest extends UnitTest {

	constructor() {
		super('Enter a room');
	}

	async run() {
		// Invalid room id
		await this.get('room');
		await this.assertError(400, 'No room id');
		await this.get('room', {id: 'abc'});
		await this.assertError(400, 'Invalid room id');

		// Enter a non-existing room
		await this.get('room', {id: 123});
		await this.assertError(404, 'The room does not exist');

		// Create a room
		let roles = [1, 2, 3, 4, 5];
		await this.post('room', {roles});
		let created_room = await this.getJSON();

		// Enter the room
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
