
const assert = require('assert');

const Role = require('../game/Role');

/* global self */

describe('Fetch role', function () {
	let room = null;
	let roles = [];

	before(async function () {
		for (let i = 0; i < 10; i++) {
			let role = Role.enums[Math.floor(Math.random() * Role.enums.length)];
			roles.push(role.toNum());
		}

		await self.post('room', {roles});
		room = await self.getJSON();
	});

	it('handles invalid seat', async function () {
		await self.get('role', {id: room.id});
		await self.assertError(400, 'Invalid seat');

		await self.get('role', {id: room.id, seat: roles.length + 1});
		await self.assertError(400, 'Invalid seat');
	});

	it('handles invalid seat key', async function () {
		await self.get('role', {id: room.id, seat: 3, key: 'test'});
		await self.assertError(403, 'Invalid seat key');
	});

	it('gets a role', async function () {
		await self.get('role', {id: room.id, seat: 3, key: Math.floor(Math.random() * 0xFFFF)});
		let my = await self.getJSON();
		assert(roles.indexOf(my.role) >= 0);
	});

	it('handles taken seat', async function () {
		await self.get('role', {id: room.id, seat: 3, key: Math.floor(Math.random() * 0xFFFF)});
		await self.assertError(409, 'The seat has been taken');
	});

	after(async function () {
		await self.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await self.assertJSON({id: room.id});
	});

});
