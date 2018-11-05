
const {POST, DELETE} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Remove a room',
	run: async function () {
		let roles = [10, 10, 10, 10];
		let res = await POST('room', {roles});
		assert.strictEqual(res.status, 200);

		let room = res.data;
		assert(room.id > 0);
		assert(room.ownerKey);

		res = await DELETE('room', {
			id: room.id,
			ownerKey: 1234,
		});
		assert.strictEqual(res.status, 404);

		res = await DELETE('room', {
			id: room.id,
			ownerKey: room.ownerKey
		});
		assert.strictEqual(res.status, 200);
		assert.strictEqual(room.id, res.data.id);
	},
};
