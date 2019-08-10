
const assert = require('assert');

const Role = require('../game/Role');
const Team = require('../game/Team');

/* global self */

describe('Thief Card', function () {

	it('provides 2 more cards', async function () {
		for (let t = 0; t < 10; t++) {
			let roles = [Role.Werewolf, Role.Thief, Role.Villager].map(role => role.toNum());
			await self.post('room', {roles});
			let room = await self.getJSON();
			assert(room.roles.length === 3);

			await self.get('role', {id: room.id, seat: 1, key: Math.floor(Math.random() * 0xFFFF)});
			let my = await self.getJSON();
			assert(my.role === Role.Thief.toNum());

			let cards = my.cards.map(role => Role.fromNum(role));
			assert(cards.length === 2);
			assert(cards.indexOf(Role.Werewolf) >= 0);
			assert(cards.indexOf(Role.Villager) >= 0);

			await self.delete('room', {id: room.id, ownerKey: room.ownerKey});
			await self.assertJSON({id: room.id});
		}
	});

	it('won\'t take 2 werewolves', async function () {
		for (let t = 0; t < 10; t++) {
			let roles = [Role.Werewolf, Role.Werewolf, Role.Werewolf, Role.AlphaWolf, Role.Thief, Role.Seer];

			await self.post('room', {roles: roles.map(role => role.toNum())});
			let room = await self.getJSON();

			await self.get('roles', {id: room.id, ownerKey: room.ownerKey});
			let players = await self.getJSON();
			let room_roles = players.map(player => player.card).map(card => Role.fromNum(card.role));
			assert(room_roles.length === roles.length - 2);

			let requested_werewolves = roles.filter(role => role.team === Team.Werewolf);
			let werewolves = room_roles.filter(role => role.team === Team.Werewolf);
			assert(requested_werewolves.length - 1 === werewolves.length);

			await self.delete('room', {id: room.id, ownerKey: room.ownerKey});
			await self.assertJSON({id: room.id});
		}
	});

	it('privides correct roles', async function () {
		for (let t = 0; t < 10; t++) {
			let roles = [
				Role.Werewolf, Role.Werewolf, Role.Werewolf, Role.AlphaWolf,
				Role.Seer, Role.Witch, Role.Hunter, Role.Magician,
				Role.Villager, Role.Villager, Role.Villager, Role.Villager, Role.Villager,
				Role.Cupid, Role.Thief,
			];

			let requested_roles = roles.map(role => role.toNum());
			await self.post('room', {roles: requested_roles});
			let room = await self.getJSON();
			assert(room.roles.length === roles.length);

			let fetched_roles = [];
			for (let seat = 1; seat <= roles.length - 2; seat++) {
				await self.get('role', {id: room.id, seat, key: seat});
				let my = await self.getJSON();
				if (my.role) {
					fetched_roles.push(my.role);
				}
				if (my.cards) {
					assert(my.cards.length === 2);

					let card1 = Role.fromNum(my.cards[0]);
					let card2 = Role.fromNum(my.cards[1]);
					assert(card1.team !== Team.Werewolf || card2.team !== Team.Werewolf);

					fetched_roles.push(...my.cards);
				}
			}

			assert(requested_roles.length === fetched_roles.length);
			requested_roles.sort();
			fetched_roles.sort();
			for (let i = 0; i < fetched_roles.length; i++) {
				assert(requested_roles[i] === fetched_roles[i]);
			}

			await self.delete('room', {id: room.id, ownerKey: room.ownerKey});
			await self.assertJSON({id: room.id});
		}
	});

});
