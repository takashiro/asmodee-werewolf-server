
const {POST, GET, DELETE} = require('../util');
const assert = require('assert');

const Role = require('../../game/Role');

module.exports = {
	name: 'Test thief card',
	run: async function () {
		for (let t = 0; t < 10; t++) {
			let roles = [Role.Werewolf, Role.Thief, Role.Villager].map(role => role.toNum());
			let res = await POST('room', {roles});

			let room = res.data;
			assert.strictEqual(room.roles.length, 3);

			let me = await GET('role', {id: room.id, seat: 1, key: Math.floor(Math.random() * 0xFFFF)});
			assert.strictEqual(Role.fromNum(me.role), Role.Thief);

			res = await DELETE('room', {id: room.id, ownerKey: room.ownerKey});
			assert.strictEqual(res.data.id, room.id);
		}
	},
};
