
const {post, array_compare} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Create a simple room',
	run: async function () {
		let roles = [1, 2, 3, 4];
		let room = await post('/createroom', {roles});

		assert(room.id > 0);
		assert(room.ownerKey);
		assert(room.salt);
		assert(array_compare(roles, room.roles));
	},
};
