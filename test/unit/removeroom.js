
const {post} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Remove a room',
	run: async function () {
		let roles = [10, 10, 10, 10];
		let room = await post('/createroom', {roles});

		assert(room.id > 0);
		assert(room.ownerKey);

		try {
			await post('/removeroom', {
				id: room.id,
				ownerKey: 1234,
			});
			assert(false);
		} catch (error) {
			assert(error === 404);
		}

		let res = await post('/removeroom', {
			id: room.id,
			ownerKey: room.ownerKey
		});

		assert(room.id === res.id);
	},
};
