import * as supertest from 'supertest';

import app from '../src/app';
import { lobby } from '../src/core';

const agent = supertest.agent(app);

const roles = [10, 10, 10, 10];
const rooms = [];
const status = {
	roomNum: 0,
	capacity: 10,
};

it('is empty at startup', async () => {
	lobby.setCapacity(10);
	const res = await agent.get('/status');
	const initialStatus = res.body;
	expect(initialStatus).toStrictEqual(status);
});

it('occupies all room capacity', async () => {
	for (let i = 0; i < status.capacity; i++) {
		const res = await agent.post('/room').send({ roles });
		const room = res.body;
		rooms.push(room);
	}
});

it('refuses to create a room if all are occupied', async () => {
	for (let i = 0; i < 3; i++) {
		await agent.post('/room').send({ roles })
			.expect(500, 'Too many rooms');
	}
});

it('deletes all rooms', async () => {
	for (const room of rooms) {
		expect(room.ownerKey).toBeTruthy();
		await agent.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
			.expect(200, { id: room.id });
	}
});

it('becomes empty', async () => {
	const res = await agent.get('/status');
	const curStatus = res.body;
	expect(curStatus).toStrictEqual(status);
});
