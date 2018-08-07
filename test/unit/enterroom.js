
const {post, array_compare} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Enter a room',
	run: async function () {
		let roles = [1, 2, 3, 4, 5];
		let created_room = await post('/createroom', {roles});

		let room = await post('/enterroom', {id: created_room.id});
		assert(room.id === created_room.id);
		assert(!room.ownerKey);
		assert(room.salt === created_room.salt);
		assert(array_compare(room.roles, created_room.roles));
	},
};
