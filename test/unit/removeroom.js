
const {POST, DELETE} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Remove a room',
	run: async function () {
		let roles = [10, 10, 10, 10];
		let room = await POST('/room', {roles});

		assert(room.id > 0);
		assert(room.ownerKey);

		try {
			await DELETE('/room', {
				id: room.id,
				ownerKey: 1234,
			});
			assert(false);
		} catch (error) {
			assert(error === 404);
		}

		let res = await DELETE('/room', {
			id: room.id,
			ownerKey: room.ownerKey
		});

		assert(room.id === res.id);
	},
};
