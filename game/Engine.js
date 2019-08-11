
const Timing = require('./Timing');
const Player = require('./Player');
const SkillList = require('../skills');
const Mode = require('./Mode');

/**
 * Shuffle an array in place
 * @param {Array} a
 */
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
}

class Engine {

	constructor() {
		this.roles = [];
		this.skills = [];
		this.players = [];
		this.mode = Mode.Normal;
	}

	/**
	 * Gets game mode
	 * @return {mode}
	 */
	getMode() {
		return this.mode;
	}

	/**
	 * Sets game mode
	 * @param {number} mode
	 */
	setMode(mode) {
		this.mode = mode;
	}

	/**
	 * Configure the roles used in the room
	 * @param {Role[]} roles
	 */
	setRoles(roles) {
		this.roles = roles;
		this.skills = SkillList
			.map(skill => new skill)
			.filter(skill => roles.indexOf(skill.role) >= 0);
	}

	/**
	 * Start to play the game
	 */
	start() {
		this.arrangeCards();
	}

	/**
	 * Arrange cards
	 */
	arrangeCards() {
		let roles = Array.from(this.roles);

		let config = {
			playerNum: roles.length,
			roles,
		};

		this.trigger(Timing.ShuffleCards, null, config);

		roles = config.roles;
		shuffle(roles);

		if (this.mode === Mode.Dual) {
			config.playerNum = Math.floor(config.playerNum / 2);
		}

		this.players = new Array(config.playerNum);
		if (this.mode === Mode.Normal) {
			for (let i = 0; i < config.playerNum; i++) {
				const player = new Player(i + 1);
				this.players[i] = player;
				player.addRole(roles[i]);
				this.trigger(Timing.DrawCard, player, config);
			}
		} else if (this.mode === Mode.Dual) {
			let k = 0;
			for (let i = 0; i < config.playerNum; i++) {
				const player = new Player(i + 1);
				this.players[i] = player;
				player.addRole(roles[k++]);
				player.addRole(roles[k++]);
				this.trigger(Timing.DrawCard, player, config);
			}
		} else {
			throw new Error('Invalid game mode');
		}
	}

	/**
	 * Check if a seat exists
	 * @param {number} seat
	 * @return {boolean}
	 */
	hasSeat(seat) {
		return !!this.players[seat - 1];
	}

	/**
	 * Take a seat and register a private key. null is returned if the seat is unavailable
	 * @param {number} seat
	 * @param {*} key
	 * @return {object}
	 */
	takeSeat(seat, key) {
		let player = this.players[seat - 1];
		if (!player) {
			return null;
		}

		if (player.getSeatKey() === null) {
			player.setSeatKey(key);
		}

		if (player.getSeatKey() === key) {
			const profile = player.getProfile();
			this.trigger(Timing.TakeSeat, player, profile);
			return profile;
		} else {
			return null;
		}
	}

	/**
	 * Trigger skills on a player
	 * @param {Timing} timing
	 * @param {Player} target
	 * @param {object} data
	 */
	trigger(timing, target, data) {
		for (let skill of this.skills) {
			if (skill.timing !== timing) {
				continue;
			}

			if (!skill.triggerable(this, target)) {
				continue;
			}

			let broken = skill.effect(this, target, data);
			if (broken) {
				break;
			}
		}
	}

	toJSON() {
		return {
			roles: this.roles,
		};
	}

}

module.exports = Engine;
