import { RoomConfig } from '@asmodee/werewolf-core';
import { randomBytes } from 'crypto';

import GameDriver from '../game/GameDriver.js';

export default class Room {
	protected id: number;

	protected salt: string;

	protected ownerKey: string;

	protected driver: GameDriver;

	protected timer?: NodeJS.Timeout;

	constructor() {
		this.id = 0;
		this.salt = randomBytes(8).toString('hex');
		this.ownerKey = randomBytes(32).toString('hex');
		this.driver = new GameDriver();
	}

	getId(): number {
		return this.id;
	}

	getOwnerKey(): string {
		return this.ownerKey;
	}

	getDriver(): GameDriver {
		return this.driver;
	}

	toJSON(): RoomConfig {
		return {
			id: this.id,
			salt: this.salt,
			...this.driver.toJSON(),
		};
	}

	setTimer(timer: NodeJS.Timeout): void {
		this.timer = timer;
	}

	destroy(): void {
		if (this.timer) {
			clearTimeout(this.timer);
			delete this.timer;
		}
	}
}
