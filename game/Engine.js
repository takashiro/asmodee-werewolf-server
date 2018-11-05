
const Card = require('./Card');
const cards = require('../cards');

class Engine {

	constructor() {
		this.cardMap = new Map;
		for (let card of cards) {
			this.registerCard(card);
		}
	}

	/**
	 * Register a new card class
	 * @param {Card} cardClass
	 */
	registerCard(cardClass) {
		this.cardMap.set(cardClass.role, cardClass);
	}

	/**
	 * Create a card instance from Role
	 * @param {Role} role role enumeration
	 * @return {Card} card instance
	 */
	createCard(role) {
		const CustomCard = this.cardMap.get(role);
		if (CustomCard) {
			return new CustomCard(role);
		} else {
			return new Card(role);
		}
	}

}

module.exports = Engine;
