
const assert = require('assert');

describe('Lobby Capacity', function () {
	let roles = [10, 10, 10, 10];
	let rooms = [];
	let old_status = null;

	it('is empty at startup', async function () {
		await self.get('status');
		old_status = await self.getJSON();
		assert(old_status.capacity > 0);
		assert(old_status.roomNum === 0);
	});

	it('occupies all room capacity', async function () {
		for (let i = 0; i < old_status.capacity; i++) {
			await self.post('room', {roles});
			let room = await self.getJSON();
			rooms.push(room);
		}
	});

	it('refuses to create a room if all are occupied', async function () {
		for (let i = 0; i < 3; i++) {
			await self.post('room', {roles});
			await self.assertError(500, 'Too many rooms');
		}
	});

	it('deletes all rooms', async function () {
		for (let room of rooms) {
			await self.delete('room', {
				id: room.id,
				ownerKey: room.ownerKey,
			});
			await self.assertJSON({id: room.id});
		}
	});

	it('becomes empty', async function () {;
		await self.get('status');
		let status = await self.getJSON();
		assert(status.capacity > 0);
		assert(status.roomNum === 0);
	});

});
