
const assert = require('assert');

const Role = require('../game/Role');
const GameMode = require('../game/Mode');

/* global self */

describe('Dual Mode', function () {
	const roles = [
		Role.AlphaWolf, Role.Werewolf,
		Role.Villager, Role.Villager,
		Role.Seer, Role.Witch,
	];
	let room = null;

	it('handles invalid game mode', async function () {
		await self.post('room', {roles: [1, 2, 3], mode: 334});
		await self.assertError(400, 'Bad game mode');
	});

	it('handles invalid role num', async function () {
		await self.post('room', {roles: [1], mode: GameMode.Dual});
		await self.assertError(400, 'Too few roles');
	});

	it('creates a room', async function () {
		await self.post('room', {roles, mode: GameMode.Dual});
		room = await self.getJSON();
	});

	it('arranges 2 cards for each player', async function () {
		const player_roles = [];
		for (let seat = 1; seat <= 3; seat++) {
			await self.get('role', {id: room.id, seat, key: 1});
			const my = await self.getJSON();
			player_roles.push(...my.roles);
			assert(my.roles.length === 2);
		}
	});

	it('destroys the room', async function () {
		await self.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await self.assertJSON({id: room.id});
	});

	it('creates a room with odd number of roles', async function () {
		await self.post('room', {roles: [Role.Werewolf, Role.Werewolf, Role.Villager], mode: GameMode.Dual});
		const room = await self.getJSON();
		assert(room.id > 0);

		await self.get('role', {id: room.id, seat: 1, key: 1});
		const my = await self.getJSON();
		assert(my.roles.length === 2);

		await self.get('role', {id: room.id, seat: 2, key: 1});
		await self.assertError(400, 'Invalid seat');

		await self.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await self.assertJSON({id: room.id});
	});

});
