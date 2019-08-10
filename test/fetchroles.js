
const assert = require('assert');

const Role = require('../game/Role');
const RoleKeys = Object.keys(Role);

/* global self */

describe('Fetch roles', function () {
	let roles = [];
	let room = null;

	before(async function () {
		for (let i = 0; i < 10; i++) {
			let role = Math.floor(Math.random() * RoleKeys.length);
			roles.push(role);
		}

		await self.post('room', {roles});
		room = await self.getJSON();
	});

	it('handles non-existing room', async function () {
		await self.get('roles', {id: room.id + 1});
		await self.assertError(404, 'The room does not exist');
	});

	it('handles invalid owner key', async function () {
		await self.get('roles', {id: room.id});
		await self.assertError(403, 'Invalid owner key');
	});

	it('returns all roles', async function () {
		await self.get('roles', {id: room.id, ownerKey: room.ownerKey});
		let profiles = await self.getJSON();
		for (let profile of profiles) {
			assert(roles.indexOf(profile.role) >= 0);
		}
	});

	after(async function () {
		await self.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await self.assertJSON({id: room.id});
	});

});
