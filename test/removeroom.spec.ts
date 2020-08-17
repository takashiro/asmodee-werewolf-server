import { agent } from 'supertest';

import app from '../src/app';

const self = agent(app);

const room = {
	id: 0,
	ownerKey: '',
};

it('creates a room', async () => {
	const roles = [10, 10, 10, 10];
	const res = await self.post('/room').send({ roles })
		.expect(200);
	Object.assign(room, res.body);
});

it('deletes a non-existing room', async () => {
	await self.delete(`/room/${room.id}?ownerKey=1234`)
		.expect(404, 'The room does not exist');
});

it('deletes a room', async () => {
	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200, { id: room.id });
});
