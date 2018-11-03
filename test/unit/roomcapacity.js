
const {POST, DELETE} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Test room manager capacity',
	run: async function () {
		let roles = [10, 10, 10, 10];
		let rooms = [];

		let error = null;
		try {
			for (let i = 0; i < 10; i++) {
				let room = await POST('/room', {roles});
				rooms.push(room);
			}
		} catch (e) {
			error = e;
		}
		assert.strictEqual(error, 500);

		for (let room of rooms) {
			let res = await DELETE('/room', {
				id: room.id,
				ownerKey: room.ownerKey,
			});

			assert(res.id === room.id);
		}
	},
};
