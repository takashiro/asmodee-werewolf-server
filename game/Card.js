
class Card {

	/**
	 * Create a card instance for a role
	 * @param {Role} role role enumeration
	 */
	constructor(role) {
		this.role = role;
		this.used = false;
	}

	/**
	 * Extra functions on shuffling cards
	 * @param {Room} room current room
	 */
	onShuffled(room) {
	}

	/**
	 * Convert card information to JSON
	 */
	toJSON() {
		return {
			role: this.role.toNum()
		};
	}

}
module.exports = Card;
