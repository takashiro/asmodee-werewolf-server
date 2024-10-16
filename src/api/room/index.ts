import {
	Router,
	Request,
	Response,
} from 'express';
import {
	Role,
	Mode,
	GameConfig,
} from '@asmodee/werewolf-core';

import {
	lobby,
	Room,
} from '../../core/index.js';

import skills from '../../skills/index.js';

import findRoom from './findRoom.js';

import seatRouter from './seat.js';
import rolesRouter from './roles.js';

const router = Router();

router.use('/:id/seat', seatRouter);
router.use('/:id/roles', rolesRouter);

interface RoomRequest extends GameConfig {
	mode: Mode;
	random: boolean;
}

type RoomResponse = GameConfig | string;

router.post('/', (req: Request<Record<string, string>, RoomResponse, RoomRequest>, res: Response<RoomResponse>) => {
	const { roles: roleIds } = req.body;
	if (!roleIds || !(roleIds instanceof Array)) {
		res.status(400).send('Invalid roles');
		return;
	}

	if (roleIds.length > 50) {
		res.status(400).send('Too many roles');
		return;
	}
	if (roleIds.length <= 0) {
		res.status(400).send('At least one role must exist');
		return;
	}

	const roles: Role[] = roleIds.filter((role) => Boolean(Role[role]));
	if (roles.length <= 0) {
		res.status(400).send('All roles are invalid');
		return;
	}

	const mode = req.body.mode || Mode.Normal;
	if (!Mode[mode]) {
		res.status(400).send('Bad game mode');
		return;
	}

	if (mode === Mode.Dual && roleIds.length < 2) {
		res.status(400).send('Too few roles');
		return;
	}

	const room = new Room();
	if (!lobby.add(room)) {
		res.status(500).send('Too many rooms');
	}

	const random = req.body.random ?? true;

	const driver = room.getDriver();
	driver.setMode(mode);
	driver.setRoles(roles);
	driver.setRandom(random);

	for (const SkillClass of skills) {
		const skill = new SkillClass();
		if (!roles.includes(skill.getRole())) {
			continue;
		}

		const effects = skill.createEffects();
		for (const effect of effects) {
			driver.register(effect);
		}
	}

	driver.start();

	const config = room.toJSON();
	config.ownerKey = room.getOwnerKey();
	res.json(config);
});

router.get('/:id', (req: Request, res: Response) => {
	const room = findRoom(req, res);
	if (room) {
		res.json(room.toJSON());
	}
});

router.delete('/:id', (req: Request, res: Response) => {
	if (!req.params.id || !req.query.ownerKey) {
		res.sendStatus(400);
		return;
	}

	const roomId = parseInt(req.params.id, 10);
	if (Number.isNaN(roomId) || roomId <= 0) {
		res.sendStatus(400);
		return;
	}

	const room = lobby.get(roomId);
	if (!room || room.getOwnerKey() !== req.query.ownerKey) {
		res.status(404).send('The room does not exist');
		return;
	}

	lobby.delete(roomId);
	res.json({
		id: roomId,
	});
});

export default router;
