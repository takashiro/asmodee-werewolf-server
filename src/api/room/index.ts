import {
	Router,
	Request,
	Response,
} from 'express';
import {
	Role,
	Mode,
} from '@asmodee/werewolf-core';

import {
	lobby,
	Room,
} from '../../core';

import skills from '../../skills';

import findRoom from './findRoom';

import seatRouter from './seat';
import rolesRouter from './roles';

const router = Router();

router.use('/:id/seat', seatRouter);
router.use('/:id/roles', rolesRouter);

router.post('/', (req: Request, res: Response) => {
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

	const mode = (req.body.mode && parseInt(req.body.mode, 10)) as Mode || Mode.Normal;
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

	const driver = room.getDriver();
	driver.setMode(mode);
	driver.setRoles(roles);

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
