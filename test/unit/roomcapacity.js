
const {POST, GET, DELETE} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Test room manager capacity',
	run: async function () {
		let roles = [10, 10, 10, 10];
		let rooms = [];

		let res = await GET('status');
		assert.strictEqual(res.status, 200);

		let old_status = res.data;
		assert(old_status.capacity > 0);
		assert.strictEqual(old_status.roomNum, 0);

		for (let i = 0; i < old_status.capacity; i++) {
			res = await POST('room', {roles});
			assert.strictEqual(res.status, 200);
			rooms.push(res.data);
		}

		for (let i = 0; i < 3; i++) {
			res = await POST('room', {roles});
			assert.strictEqual(res.status, 500);
		}

		for (let room of rooms) {
			res = await DELETE('room', {
				id: room.id,
				ownerKey: room.ownerKey,
			});
			assert.strictEqual(res.status, 200);
			assert.strictEqual(res.data.id, room.id);
		}

		res = await GET('status');
		assert.strictEqual(res.data.roomNum, 0);
	},
};
