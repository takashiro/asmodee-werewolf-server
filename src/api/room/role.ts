import {
	Router,
	Request,
	Response,
} from 'express';

import findRoom from './findRoom';

const router = Router({
	mergeParams: true,
});

router.get('/:seat', (req: Request, res: Response) => {
	const room = findRoom(req, res);
	if (!room) {
		return;
	}

	const driver = room.getDriver();
	const seat = Number.parseInt(req.params.seat, 10);
	if (Number.isNaN(seat) || !driver.hasSeat(seat)) {
		res.status(400).send('Invalid seat');
		return;
	}

	const { key } = req.query;
	if (!key || typeof key !== 'string') {
		res.status(403).send('Invalid seat key');
		return;
	}

	const profile = driver.takeSeat(seat, key);
	if (!profile) {
		res.status(409).send('The seat has been taken');
		return;
	}

	res.json(profile);
});

export default router;
