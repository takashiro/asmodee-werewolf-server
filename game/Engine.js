
const Card = require('./Card');
const cards = require('../cards');

class Engine {

	constructor() {
		this.cardMap = [];
		for (let card of cards) {
			this.registerCard(card);
		}
	}

	/**
	 * Register a new card type
	 * @param {Card} card
	 */
	registerCard(card) {
		this.cardMap[card.role] = card;
	}

	/**
	 * Create a card instance from Role
	 * @param {Role} role role enumeration
	 * @return {Card} card instance
	 */
	createCard(role) {
		const CustomCard = this.cardMap[role];
		if (CustomCard) {
			return new CustomCard(role);
		} else {
			return new Card(role);
		}
	}

}

module.exports = Engine;
