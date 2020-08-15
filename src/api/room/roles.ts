import {
	Router,
	Request,
	Response,
} from 'express';

import findRoom from './findRoom';

const router = Router({
	mergeParams: true,
});

router.get('/', (req: Request, res: Response) => {
	const room = findRoom(req, res);
	if (!room) {
		return;
	}

	if (room.getOwnerKey() !== req.query.ownerKey) {
		res.status(403).send('Invalid owner key');
		return;
	}

	const driver = room.getDriver();
	const players = driver.getPlayers();
	const profiles = players.map((player) => player.getProfile());
	res.json(profiles);
});

export default router;
