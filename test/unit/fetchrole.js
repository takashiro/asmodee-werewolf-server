
const {POST, GET, DELETE} = require('../util');
const assert = require('assert');

const Role = require('../../game/Role');

module.exports = {
	name: 'Fetch role',
	run: async function () {
		let roles = [];
		for (let i = 0; i < 10; i++) {
			let role = Role.enums[Math.floor(Math.random() * Role.enums.length)];
			roles.push(role.toNum());
		}

		let res = await POST('room', {roles});
		assert.strictEqual(res.status, 200);
		let room = res.data;

		res = await GET('role', {id: room.id});
		assert.strictEqual(res.status, 400);

		res = await GET('role', {id: room.id, seat: roles.length + 1});
		assert.strictEqual(res.status, 400);

		res = await GET('role', {id: room.id, seat: 3, key: 'test'});
		assert.strictEqual(res.status, 403);

		res = await GET('role', {id: room.id, seat: 3, key: Math.floor(Math.random() * 0xFFFF)});
		assert(roles.indexOf(res.data.role) >= 0);

		res = await GET('role', {id: room.id, seat: 3, key: Math.floor(Math.random() * 0xFFFF)});
		assert.strictEqual(res.status, 409);

		res = await DELETE('room', {id: room.id, ownerKey: room.ownerKey});
		assert.strictEqual(res.status, 200);
	},
};
