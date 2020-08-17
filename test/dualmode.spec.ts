import {
	agent,
	Response,
} from 'supertest';
import {
	Role,
	Mode,
} from '@asmodee/werewolf-core';

import app from '../src/app';

const self = agent(app);

const roles = [
	Role.AlphaWolf, Role.Werewolf,
	Role.Villager, Role.Villager,
	Role.Seer, Role.Witch,
];
const room = {
	id: 0,
	ownerKey: '',
};
let res: Response;

it('handles invalid game mode', async () => {
	await self.post('/room').send({ roles: [1, 2, 3], mode: 334 })
		.expect(400, 'Bad game mode');
});

it('handles invalid role num', async () => {
	await self.post('/room').send({ roles: [1], mode: Mode.Dual })
		.expect(400, 'Too few roles');
});

it('creates a room', async () => {
	res = await self.post('/room').send({ roles, mode: Mode.Dual });
	Object.assign(room, res.body);
});

it('arranges 2 cards for each player', async () => {
	for (let seat = 1; seat <= 3; seat++) {
		res = await self.get(`/room/${room.id}/seat/${seat}?key=1`);
		const my = res.body;
		expect(my.roles).toHaveLength(2);
	}
});

it('destroys the room', async () => {
	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200, { id: room.id });
});

it('creates a room with odd number of roles', async () => {
	res = await self.post('/room').send({ roles: [Role.Werewolf, Role.Werewolf, Role.Villager], mode: Mode.Dual })
		.expect(200);
	Object.assign(room, res.body);

	res = await self.get(`/room/${room.id}/seat/1?key=1`)
		.expect(200);
	const my = res.body;
	expect(my.roles).toHaveLength(2);

	await self.get(`/room/${room.id}/seat/2?key=2`)
		.expect(400, 'Invalid seat');

	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200, { id: room.id });
});
