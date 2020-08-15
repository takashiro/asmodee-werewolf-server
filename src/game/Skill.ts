import { Role } from '@asmodee/werewolf-core';

import GameEvent from './GameEvent';
import EventListener from './EventListener';
import GameDriver from './GameDriver';

export default abstract class Skill<ParamType> extends EventListener<GameEvent, ParamType> {
	readonly role: Role;

	protected driver?: GameDriver;

	/**
	 * Create a card instance for a role
	 * @param event
	 * @param role
	 */
	constructor(event: GameEvent, role: Role) {
		super(event);
		this.role = role;
	}

	setDriver(driver: GameDriver): void {
		this.driver = driver;
	}
}
