#!/usr/bin/env node

import config from './util/config.js';
import { lobby } from './core/index.js';
import app from './app.js';

(async function main(): Promise<void> {
	await config.read();
	lobby.setCapacity(config.lobbyCapacity);
	app.listen(config.socket);
}());
