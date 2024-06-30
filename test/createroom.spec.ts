import { expect, it } from '@jest/globals';
import supertest from 'supertest';
import { RoomConfig } from '@asmodee/werewolf-core';

import app from '../src/app.js';

const agent = supertest.agent(app);

it('should handle invalid roles', async () => {
	await agent.post('/room')
		.expect(400, 'Invalid roles');
	await agent.post('/room').send({ roles: {} })
		.expect(400, 'Invalid roles');
});

it('should handle no role', async () => {
	await agent.post('/room').send({ roles: [] })
		.expect(400, 'At least one role must exist');
});

it('should handle that all roles are invalid', async () => {
	await agent.post('/room').send({ roles: [1001, 1002, 1003] })
		.expect(400, 'All roles are invalid');
});

it('cannot create a room with over 50 players', async () => {
	const roles = new Array(51).fill(24);
	await agent.post('/room').send({ roles })
		.expect(400, 'Too many roles');
});

it('should create a room', async () => {
	const roles = [1, 2, 3, 4];
	const res = await agent.post('/room').send({ roles });
	const room = res.body as RoomConfig;
	expect(room.id).toBeGreaterThan(0);
	expect(room.ownerKey).toBeTruthy();
	expect(room.salt).toBeTruthy();
	expect(room.roles).toStrictEqual(roles);

	if (room.ownerKey) {
		await agent.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
			.expect(200, { id: room.id });
	}
});
