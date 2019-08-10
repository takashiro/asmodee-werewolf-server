
const Timing = require('./Timing');
const Player = require('./Player');
const SkillList = require('../skills');

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

		this.players = new Array(config.playerNum);
		for (let i = 0; i < config.playerNum; i++) {
			let player = new Player(i + 1);
			this.players[i] = player;
			player.setRole(roles[i]);
			this.trigger(Timing.DrawCard, player, config);
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
			let seat = {
				role: player.getRole()
			};
			this.trigger(Timing.TakeSeat, player, seat);
			return seat;
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
