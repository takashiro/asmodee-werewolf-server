import { agent } from 'supertest';
import { Role } from '@asmodee/werewolf-core';

import app from '../src/app';

const self = agent(app);
const RoleKeys = Object.keys(Role);

const room = {
	id: 0,
	ownerKey: '',
};
const roles = [];

beforeAll(async () => {
	for (let i = 0; i < 10; i++) {
		const role = Math.floor(Math.random() * RoleKeys.length);
		roles.push(role);
	}

	const res = await self.post('/room').send({ roles });
	Object.assign(room, res.body);
});

afterAll(async () => {
	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200, { id: room.id });
});

it('handles invalid seat', async () => {
	await self.get(`/room/${room.id}/seat`)
		.expect(404);

	await self.get(`/room/${room.id}/seat/${roles.length + 1}`)
		.expect(400, 'Invalid seat');
});

it('handles invalid seat key', async () => {
	await self.get(`/room/${room.id}/seat/3?key[]=test`)
		.expect(403, 'Invalid seat key');
});

it('gets a role', async () => {
	const res = await self.get(`/room/${room.id}/seat/3?key=${Math.floor(Math.random() * 0xFFFF)}`)
		.expect(200);
	const [role] = res.body.roles;
	expect(roles).toContain(role);
});

it('handles taken seat', async () => {
	await self.get(`/room/${room.id}/seat/3?key=${Math.floor(Math.random() * 0xFFFF)}`)
		.expect(409, 'The seat has been taken');
});
