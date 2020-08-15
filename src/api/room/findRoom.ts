import {
	Request,
	Response,
} from 'express';

import {
	lobby,
	Room,
} from '../../core';

export default function findRoom(req: Request, res: Response): Room | undefined {
	if (!req.params.id) {
		res.status(400).send('No room id');
		return;
	}

	const id = Number.parseInt(req.params.id, 10);
	if (Number.isNaN(id)) {
		res.status(400).send('Invalid room id');
		return;
	}

	const room = lobby.get(id);
	if (!room) {
		res.status(404).send('The room does not exist');
		return;
	}

	return room;
}
