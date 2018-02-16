
const Card = require('../core/Card');
const Role = require('../core/Role');

class ThiefCard extends Card {

	constructor() {
		super(Role.Thief);
	}

	onShuffled(room) {
		let unused_cards = room.fetchUnusedCards();
		if (unused_cards.length <= 0) {
			return;
		}

		let thief_cards = [];
		function markUsed(filter) {
			for (let card of unused_cards) {
				if (!card.used && filter(card)) {
					card.used = true;
					thief_cards.push(card);
				}
			}
		}

		markUsed(card => card.role == Role.Thief);

		this.cards = [null, null];

		this.cards[0] = room.fetchCard();
		if (this.cards[0] && Role.isWerewolf(this.cards[0].role)) {
			markUsed(card => Role.isWerewolf(card.role));
		}

		this.cards[1] = room.fetchCard();

		for (let card of thief_cards) {
			card.used = false;
		}
	}

	toJSON() {
		let result = super.toJSON();
		result.cards = [0, 0];
		if (this.cards[0]) {
			result.cards[0] = this.cards[0].role;
		}
		if (this.cards[1]) {
			result.cards[1] = this.cards[1].role;
		}
		return result;
	}

}

ThiefCard.Role = Role.Thief;
module.exports = ThiefCard;
