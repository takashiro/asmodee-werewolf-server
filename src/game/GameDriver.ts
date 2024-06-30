import {
	GameConfig,
	Mode,
	Role,
	PlayerProfile,
} from '@asmodee/werewolf-core';

import GameEvent from './GameEvent.js';
import Player from './Player.js';
import EventDriver from './EventDriver.js';

import shuffle from '../util/shuffle.js';

export default class GameDriver extends EventDriver<GameEvent> {
	protected mode: Mode;

	protected roles: Role[];

	protected players: Player[];

	protected random = true;

	constructor() {
		super();
		this.mode = Mode.Normal;
		this.roles = [];
		this.players = [];
	}

	/**
	 * @return game mode
	 */
	getMode(): Mode {
		return this.mode;
	}

	/**
	 * Sets game mode
	 * @param mode
	 */
	setMode(mode: Mode): void {
		this.mode = mode;
	}

	/**
	 * Configure the roles used in the room
	 * @param {Role[]} roles
	 */
	setRoles(roles: Role[]): void {
		this.roles = roles;
	}

	/**
	 * @returns All players
	 */
	getPlayers(): Player[] {
		return this.players;
	}

	/**
	 * @returns Whether to shuffle player roles.
	 */
	isRandom(): boolean {
		return this.random;
	}

	/**
	 * Sets whether to shuffle roles.
	 * @param random Whether to shuffle player roles.
	 */
	setRandom(random: boolean): void {
		this.random = random;
	}

	/**
	 * Start to play the game
	 */
	start(): void {
		this.arrangeCards();
	}

	/**
	 * Arrange cards
	 */
	arrangeCards(): void {
		const roles = [...this.roles];
		if (this.isRandom()) {
			shuffle(roles);
		}

		const config: GameConfig = {
			playerNum: roles.length,
			roles,
		};
		this.trigger(GameEvent.ShuffleCards, config);

		if (this.mode === Mode.Dual) {
			config.playerNum = Math.floor(config.playerNum / 2);
		}

		this.players = new Array(config.playerNum);
		if (this.mode === Mode.Normal) {
			for (let i = 0; i < config.playerNum; i++) {
				const player = new Player(i + 1);
				this.players[i] = player;
				player.addRole(roles[i]);
				this.trigger(GameEvent.DrawCard, player);
			}
		} else if (this.mode === Mode.Dual) {
			let k = 0;
			for (let i = 0; i < config.playerNum; i++) {
				const player = new Player(i + 1);
				this.players[i] = player;
				player.addRole(roles[k++]);
				player.addRole(roles[k++]);
				this.trigger(GameEvent.DrawCard, player);
			}
		}
	}

	/**
	 * Check if a seat exists
	 * @param seat
	 */
	hasSeat(seat: number): boolean {
		return Boolean(this.players[seat - 1]);
	}

	/**
	 * Take a seat and register a private key. null is returned if the seat is unavailable
	 * @param seat
	 * @param key
	 * @return {object}
	 */
	takeSeat(seat: number, key: string): PlayerProfile | null {
		if (!key) {
			return null;
		}

		const player = this.players[seat - 1];
		if (!player) {
			return null;
		}

		if (player.getSeatKey() === undefined) {
			player.setSeatKey(key);
		} else if (player.getSeatKey() !== key) {
			return null;
		}

		const profile = player.getProfile();
		return profile;
	}

	toJSON(): GameConfig {
		return {
			playerNum: this.players.length,
			roles: this.roles,
		};
	}
}
