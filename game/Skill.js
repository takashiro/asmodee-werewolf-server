
class Skill {

	/**
	 * Create a card instance for a role
	 * @param {Timing} timing
	 * @param {Role} role
	 */
	constructor(timing, role) {
		this.timing = timing;
		this.role = role;
	}

	/**
	 * Check if this skill is triggerable on a player
	 * @param {Room} room
	 * @param {Player} target
	 * @return {boolean}
	 */
	triggerable(room, target) {
		return room && target.hasRole(this.role);
	}

	/**
	 * Take effects on a player
	 * @param {Room} room
	 * @param {Player} target
	 * @param {object} data
	 * @return {boolean} whether to break following effects
	 */
	effect(room, target, data) {
		return false;
	}

}

module.exports = Skill;
