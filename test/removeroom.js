
const assert = require('assert');

describe('Remove a room', function () {
	let room = null;

	it('creates a room', async function () {
		let roles = [10, 10, 10, 10];
		await self.post('room', {roles});
		room = await self.getJSON();
		assert(room.id > 0);
		assert(room.ownerKey);
	});

	it('deletes a non-existing room', async function () {
		await self.delete('room', {
			id: room.id,
			ownerKey: 1234,
		});
		await self.assertError(404, 'The room does not exist');
	});

	it('deletes a room', async function () {
		await self.delete('room', {
			id: room.id,
			ownerKey: room.ownerKey
		});
		await self.assertJSON({id: room.id});
	});

});
