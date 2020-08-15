import {
	Router,
	Request,
	Response,
} from 'express';

import { lobby } from '../core';

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.json(lobby.getStatus());
});

export default router;
