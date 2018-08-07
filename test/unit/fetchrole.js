
const {post, array_compare} = require('../util');
const assert = require('assert');

module.exports = {
	name: 'Fetch role',
	run: async function () {
		let roles = [1, 2, 3, 4, 5];
		let room = await post('/createroom', {roles});

		let res;
		res = await post('/fetchrole', {id: room.id});
		assert(res.error === 'INVALID_SEAT');

		res = await post('/fetchrole', {id: room.id, seat: 6});
		assert(res.error === 'INVALID_SEAT');

		res = await post('/fetchrole', {id: room.id, seat: 3, key: 'test'});
		assert(res.error === 'INVALID_SEATKEY');

		res = await post('/fetchrole', {id: room.id, seat: 3, key: Math.floor(Math.random() * 0xFFFF)});
		assert(roles.indexOf(res.role) >= 0);
	},
};
