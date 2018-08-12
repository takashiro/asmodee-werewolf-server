
const {post} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Test room manager capacity',
	run: async function () {
		let roles = [10, 10, 10, 10];
		let rooms = [];

		try {
			for (let i = 0; i < 10; i++) {
				let room = await post('/createroom', {roles});
				rooms.push(room);
			}
			assert(false);
		} catch (error) {
			assert(error === 400);
		}

		for (let room of rooms) {
			let res = await post('/removeroom', {
				id: room.id,
				ownerKey: room.ownerKey,
			});

			assert(res.id === room.id);
		}
	},
};
