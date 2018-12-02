
const net = require('../net');
const assert = require('assert');

const Role = require('../../game/Role');
const Team = require('../../game/Team');

module.exports = {
	name: 'Test thief card',
	run: async function () {
		for (let t = 0; t < 10; t++) {
			let roles = [Role.Werewolf, Role.Thief, Role.Villager].map(role => role.toNum());
			let res = await net.POST('room', {roles});

			let room = res.data;
			assert.strictEqual(room.roles.length, 3);

			res = await net.GET('role', {id: room.id, seat: 1, key: Math.floor(Math.random() * 0xFFFF)});
			assert.strictEqual(Role.fromNum(res.data.role), Role.Thief);

			let cards = res.data.cards.map(role => Role.fromNum(role));
			assert.strictEqual(cards.length, 2);
			assert(cards.indexOf(Role.Werewolf) >= 0);
			assert(cards.indexOf(Role.Villager) >= 0);

			res = await net.DELETE('room', {id: room.id, ownerKey: room.ownerKey});
			assert.strictEqual(res.data.id, room.id);
		}

		// Make sure the thief won't take 2 werewolves
		for (let t = 0; t < 10; t++) {
			let roles = [Role.Werewolf, Role.Werewolf, Role.Werewolf, Role.AlphaWolf, Role.Thief, Role.Seer];

			let res = await net.POST('room', {roles: roles.map(role => role.toNum())});
			assert.strictEqual(res.status, 200);

			let room = res.data;
			res = await net.GET('roles', {id: room.id, ownerKey: room.ownerKey});
			assert.strictEqual(res.status, 200);

			let players = res.data;
			let room_roles = players.map(player => player.card).map(card => Role.fromNum(card.role));
			assert.strictEqual(room_roles.length, roles.length - 2);

			let requested_werewolves = roles.filter(role => role.team === Team.Werewolf);
			let werewolves = room_roles.filter(role => role.team === Team.Werewolf);
			assert.strictEqual(requested_werewolves.length - 1, werewolves.length);
		}
	},
};
