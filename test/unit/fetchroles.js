
const {POST, GET, arrayCompare} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Fetch roles',
	run: async function () {
		let roles = [];
		for (let i = 0; i < 10; i++) {
			roles.push(Math.floor(Math.random() * 0xFF));
		}

		let room = await POST('/room', {roles});

		let res = null;
		try {
			res = await GET('/roles', {id: room.id + 1});
		} catch (error) {
			res = error;
		}
		assert.strictEqual(res, 404);

		res = null;
		try {
			res = await GET('/roles', {id: room.id});
		} catch (error) {
			res = error;
		}
		assert.strictEqual(res, 403);

		res = null;
		try {
			res = await GET('/roles', {id: room.id, ownerKey: room.ownerKey});
		} catch (error) {
			res = error;
		}
		for (let {seat, card} of res) {
			assert(roles.indexOf(card.role) >= 0);
		}
	},
};
