
const assert = require('assert');
const UnitTest = require('../UnitTest');

class RoomCapacityTest extends UnitTest {

	constructor() {
		super('Test room manager capacity');
	}

	async run() {
		let roles = [10, 10, 10, 10];
		let rooms = [];

		await this.get('status');
		let old_status = await this.getJSON();
		assert(old_status.capacity > 0);
		assert(old_status.roomNum === 0);

		for (let i = 0; i < old_status.capacity; i++) {
			await this.post('room', {roles});
			let room = await this.getJSON();
			rooms.push(room);
		}

		for (let i = 0; i < 3; i++) {
			await this.post('room', {roles});
			await this.assertError(500, 'Too many rooms');
		}

		for (let room of rooms) {
			await this.delete('room', {
				id: room.id,
				ownerKey: room.ownerKey,
			});
			await this.assertJSON({id: room.id});
		}

		await this.get('status');
		let status = await this.getJSON();
		assert(status.capacity > 0);
		assert(status.roomNum === 0);
	}

}

module.exports = RoomCapacityTest;
