#!/usr/bin/env node

import config from './util/config';
import { lobby } from './core';
import app from './app';

(async function main(): Promise<void> {
	await config.read();
	lobby.setCapacity(config.lobbyCapacity);
	app.listen(config.socket);
}());
