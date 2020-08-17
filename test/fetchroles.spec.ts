import { agent } from 'supertest';
import { Role } from '@asmodee/werewolf-core';

import app from '../src/app';

const RoleKeys = Object.keys(Role);
const self = agent(app);

const roles = [];
const room = {
	id: 0,
	ownerKey: '',
};

beforeAll(async () => {
	for (let i = 0; i < 10; i++) {
		const role = Math.floor(Math.random() * RoleKeys.length);
		roles.push(role);
	}

	const res = await self.post('/room').send({ roles })
		.expect(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200, { id: room.id });
});

it('handles non-existing room', async () => {
	await self.get(`/room/${room.id + 1}/roles`)
		.expect(404, 'The room does not exist');
});

it('handles invalid owner key', async () => {
	await self.get(`/room/${room.id}/roles`)
		.expect(403, 'Invalid owner key');
});

it('returns all roles', async () => {
	const res = await self.get(`/room/${room.id}/roles?ownerKey=${encodeURIComponent(room.ownerKey)}`);
	const profiles = res.body;
	for (const profile of profiles) {
		const [role] = profile.roles;
		expect(roles).toContain(role);
	}
});
