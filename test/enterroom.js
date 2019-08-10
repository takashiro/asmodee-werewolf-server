
const assert = require('assert');

/* global self */

describe('Enter a room', function () {

	it('should handle invalid room id', async function () {
		await self.get('room');
		await self.assertError(400, 'No room id');
		await self.get('room', {id: 'abc'});
		await self.assertError(400, 'Invalid room id');
	});

	it('should handle non-existing room id', async function () {
		await self.get('room', {id: 123});
		await self.assertError(404, 'The room does not exist');
	});

	it('enters a room', async function () {
		let roles = [1, 2, 3, 4, 5];
		await self.post('room', {roles});
		let created_room = await self.getJSON();

		// Enter the room
		await self.get('room', {id: created_room.id});
		let room = await self.getJSON();
		assert(room.id === created_room.id);
		assert(!room.ownerKey);
		assert(room.salt === created_room.salt);
		assert(room.roles.length === created_room.roles.length);
		for (let i = 0; i < room.roles.length; i++) {
			assert(room.roles[i] === created_room.roles[i]);
		}

		await self.delete('room', {id: created_room.id, ownerKey: created_room.ownerKey});
		await self.assertJSON({id: created_room.id});
	});

});
