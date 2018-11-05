
const {POST, GET, DELETE, arrayCompare} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Enter a room',
	run: async function () {
		let roles = [1, 2, 3, 4, 5];
		let res = await POST('room', {roles});
		assert.strictEqual(res.status, 200);
		let created_room = res.data;

		res = await GET('room', {id: created_room.id});
		assert.strictEqual(res.status, 200);

		let room = res.data;
		assert.strictEqual(room.id, created_room.id);
		assert(!room.ownerKey);
		assert.strictEqual(room.salt, created_room.salt);
		assert(arrayCompare(room.roles, created_room.roles));

		res = await DELETE('room', {id: created_room.id, ownerKey: created_room.ownerKey});
		assert.strictEqual(res.status, 200);
	},
};
