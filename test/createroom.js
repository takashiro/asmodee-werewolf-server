
const assert = require('assert');

/* global self */

describe('Create a simple room', function () {

	it('should handle invalid roles', async function () {
		await self.post('room');
		await self.assertError(400, 'Invalid roles');
		await self.post('room', {roles: {}});
		await self.assertError(400, 'Invalid roles');
	});

	it('should handle no role', async function () {
		await self.post('room', {roles: []});
		await self.assertError(400, 'At least one role must exist');
	});

	it('should handle that all roles are invalid', async function () {
		await self.post('room', {roles: [1001, 1002, 1003]});
		await self.assertError(400, 'All roles are invalid');
	});

	it('should create a room', async function () {
		let roles = [1, 2, 3, 4];
		await self.post('room', {roles});
		let room = await self.getJSON();
		assert(room.id > 0);
		assert(room.ownerKey);
		assert(room.salt);
		assert(roles.length === room.roles.length);
		for (let i = 0; i < roles.length; i++) {
			assert(roles[i] === room.roles[i]);
		}

		await self.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await self.assertJSON({id: room.id});
	});
});
