
const assert = require('assert');
const UnitTest = require('../UnitTest');

class RemoveRoomTest extends UnitTest {

	constructor() {
		super('Remove a room');
	}

	async run() {
		let roles = [10, 10, 10, 10];
		await this.post('room', {roles});
		let room = await this.getJSON();
		assert(room.id > 0);
		assert(room.ownerKey);

		await this.delete('room', {
			id: room.id,
			ownerKey: 1234,
		});
		await this.assertError(404, 'The room does not exist');

		await this.delete('room', {
			id: room.id,
			ownerKey: room.ownerKey
		});
		await this.assertJSON({id: room.id});
	}

}

module.exports = RemoveRoomTest;
