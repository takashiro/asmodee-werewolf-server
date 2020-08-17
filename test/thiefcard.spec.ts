import {
	agent,
	Response,
} from 'supertest';
import {
	Role,
	Team,
	Teamship,
} from '@asmodee/werewolf-core';

import app from '../src/app';

const self = agent(app);
let res: Response;

it('provides 2 more cards', async () => {
	const roles = [Role.Werewolf, Role.Thief, Role.Villager];
	res = await self.post('/room').send({ roles })
		.expect(200);
	const room = res.body;
	expect(room.roles).toHaveLength(3);

	res = await self.get(`/room/${room.id}/seat/1?key=${Math.floor(Math.random() * 0xFFFF)}`);
	const my = res.body;
	expect(my.roles).toContain(Role.Thief);
	expect(my.roles).toContain(Role.Werewolf);
	expect(my.roles).toContain(Role.Villager);

	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200, { id: room.id });
});

it('will not take 2 werewolves', async () => {
	const roles = [Role.Werewolf, Role.Werewolf, Role.Werewolf, Role.AlphaWolf, Role.Thief, Role.Seer];

	res = await self.post('/room').send({ roles })
		.expect(200);
	const room = res.body;

	res = await self.get(`/room/${room.id}/roles?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200);
	const players = res.body;
	expect(players).toHaveLength(roles.length - 2);

	const thief = players.find((player) => player.roles.includes(Role.Thief));
	expect(thief.roles).toHaveLength(3);
	expect(thief.roles).toContain(Role.Seer);

	const others = players.filter((player) => player !== thief);
	for (const other of others) {
		expect(other.roles).toHaveLength(1);
		expect(Teamship.get(other.roles[0])).toBe(Team.Werewolf);
	}

	await self.delete(`/room/${room.id}?ownerKey=${room.ownerKey}`)
		.expect(200, { id: room.id });
});

it('privides correct roles', async () => {
	for (let t = 0; t < 10; t++) {
		const roles = [
			Role.Werewolf, Role.Werewolf, Role.Werewolf, Role.AlphaWolf,
			Role.Seer, Role.Witch, Role.Hunter, Role.Magician,
			Role.Villager, Role.Villager, Role.Villager, Role.Villager, Role.Villager,
			Role.Cupid, Role.Thief,
		];

		res = await self.post('/room').send({ roles })
			.expect(200);
		const room = res.body;
		expect(room.roles).toHaveLength(roles.length);

		const players = [];
		for (let seat = 1; seat <= roles.length - 2; seat++) {
			res = await self.get(`/room/${room.id}/seat/${seat}?key=${seat}`)
				.expect(200);
			const player = res.body;
			players.push(player);

			if (player.roles.includes(Role.Thief)) {
				expect(player.roles).toHaveLength(3);
				const teams = player.roles.map((role) => Teamship.get(role));
				expect(teams[1] !== Team.Werewolf || teams[2] !== Team.Werewolf).toBe(true);
			} else {
				expect(player.roles).toHaveLength(1);
			}
		}

		expect(players).toHaveLength(roles.length - 2);
		for (const player of players) {
			const [role] = player.roles;
			expect(roles).toContain(role);
		}

		await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
			.expect(200, { id: room.id });
	}
});
