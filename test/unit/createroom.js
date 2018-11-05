
const {POST, DELETE, arrayCompare} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Create a simple room',
	run: async function () {
		let roles = [1, 2, 3, 4];

		let res = await POST('room', {roles});
		assert.strictEqual(res.status, 200);

		let room = res.data;
		assert(room.id > 0);
		assert(room.ownerKey);
		assert(room.salt);
		assert(arrayCompare(roles, room.roles));

		res = await DELETE('room', {id: room.id, ownerKey: room.ownerKey});
		assert.strictEqual(res.status, 200);
	},
};
