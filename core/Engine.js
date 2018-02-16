
const Card = require('./Card');

class Engine {

	constructor() {
		this.cardMap = [];
	}

	/**
	 * Add a new card
	 */
	addCard(role, card) {
		this.cardMap[role] = card;
	}

	/**
	 * Create a card instance from Role
	 * @param {Role} role role enumeration
	 * @return {Card} card instance
	 */
	createCard(role) {
		const RoleCard = this.cardMap[role];
		if (RoleCard) {
			return new RoleCard;
		} else {
			return new Card(role);
		}
	};

	/**
	 * Load all cards in the directory
	 * @param {string} dir target directory
	 */
	loadCards(dir) {
		const fs = require('fs');
		fs.readdirSync(dir).forEach(file => {
			if (file != 'index.js') {
				const Card = require(dir + '/' + file);
				if (Card && Card.Role) {
					this.addCard(Card.Role, Card);
				}
			}
		});
	}

}

module.exports = Engine;
