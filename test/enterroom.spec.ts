import { agent } from 'supertest';

import app from '../src/app';

const self = agent(app);

it('should handle invalid room id', async () => {
	await self.get('/room')
		.expect(404);
	await self.get('/room/abc')
		.expect(400, 'Invalid room id');
});

it('should handle non-existing room id', async () => {
	await self.get('/room/123')
		.expect(404, 'The room does not exist');
});

it('enters a room', async () => {
	const roles = [1, 2, 3, 4, 5];
	let res = await self.post('/room').send({ roles });
	const croom = res.body;

	// Enter the room
	res = await self.get(`/room/${croom.id}`);
	const room = res.body;
	expect(room.id).toBe(croom.id);
	expect(room.ownerKey).toBeUndefined();
	expect(room.salt).toBe(croom.salt);
	expect(room.roles).toStrictEqual(croom.roles);

	await self.delete(`/room/${croom.id}?ownerKey=${encodeURIComponent(croom.ownerKey)}`)
		.expect(200, { id: croom.id });
});
