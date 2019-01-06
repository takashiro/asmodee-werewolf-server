
const assert = require('assert');
const arrayEqual = require('../arrayEqual');
const UnitTest = require('../UnitTest');

class CreateRoomTest extends UnitTest {

	constructor() {
		super('Create a simple room');
	}

	async run() {
		let roles = [1, 2, 3, 4];

		await this.post('room', {roles});
		let room = await this.getJSON();
		assert(room.id > 0);
		assert(room.ownerKey);
		assert(room.salt);
		assert(arrayEqual(roles, room.roles));

		await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await this.assertJSON({id: room.id});
	}

};

module.exports = CreateRoomTest;
