
const {POST, GET, DELETE} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Fetch roles',
	run: async function () {
		let roles = [];
		for (let i = 0; i < 10; i++) {
			roles.push(Math.floor(Math.random() * 0xFF));
		}

		let res = await POST('room', {roles});
		assert.strictEqual(res.status, 200);
		let room = res.data;

		res = await GET('roles', {id: room.id + 1});
		assert.strictEqual(res.status, 404);

		res = await GET('roles', {id: room.id});
		assert.strictEqual(res.status, 403);

		res = await GET('roles', {id: room.id, ownerKey: room.ownerKey});
		assert.strictEqual(res.status, 200);
		for (let {seat, card} of res.data) {
			assert(roles.indexOf(card.role) >= 0);
		}

		res = await DELETE('room', {id: room.id, ownerKey: room.ownerKey});
		assert.strictEqual(res.status, 200);
	},
};
