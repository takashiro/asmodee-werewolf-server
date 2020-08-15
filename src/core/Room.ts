import { RoomConfig } from '@asmodee/werewolf-core';

import GameDriver from '../game/GameDriver';
import randstr from '../util/randstr';

export default class Room {
	protected id: number;

	protected salt: string;

	protected ownerKey: string;

	protected driver: GameDriver;

	protected timer?: NodeJS.Timer;

	constructor() {
		this.id = 0;
		this.salt = randstr(8);
		this.ownerKey = randstr(32);
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

	setTimer(timer: NodeJS.Timer): void {
		this.timer = timer;
	}

	destroy(): void {
		if (this.timer) {
			clearTimeout(this.timer);
			delete this.timer;
		}
	}
}
