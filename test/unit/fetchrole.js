
const {POST, GET} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Fetch role',
	run: async function () {
		let roles = [];
		for (let i = 0; i < 10; i++) {
			roles.push(Math.floor(Math.random() * 0xFF));
		}

		let room = await POST('/room', {roles});

		let res = null;
		try {
			res = await GET('/role', {id: room.id});
		} catch (error) {
			res = error;
		}
		assert.strictEqual(res, 400);

		res = null;
		try {
			res = await GET('/role', {id: room.id, seat: roles.length + 1});
		} catch (error) {
			res = error;
		}
		assert.strictEqual(res, 400);

		res = null;
		try {
			res = await GET('/role', {id: room.id, seat: 3, key: 'test'});
		} catch (error) {
			res = error;
		}
		assert.strictEqual(res, 403);

		res = await GET('/role', {id: room.id, seat: 3, key: Math.floor(Math.random() * 0xFFFF)});
		assert(roles.indexOf(res.role) >= 0);

		res = null;
		try {
			res = await GET('/role', {id: room.id, seat: 3, key: Math.floor(Math.random() * 0xFFFF)});
		} catch (error) {
			res = error;
		}
		assert.strictEqual(res, 409);
	},
};
