
const Engine = require('../game/Engine');
const game = new Engine;

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

/**
 * Generate a random string
 * @param {number} length
 * @return {string}
 */
function randomstr(length){
	let str = '';
	for(let i = 0; i < length; i++){
		let rand = Math.floor(Math.random() * 62);
		if(rand >= 0 && rand <= 25){
			rand += 0x41;
		}else if(rand <= 51){
			rand -= 26;
			rand += 0x61;
		}else{
			rand -= 52;
			rand += 0x30;
		}
		str += String.fromCharCode(rand);
	}

	return str;
}

class Room {

	constructor() {
		this.id = 0;
		this.salt = randomstr(8);
		this.ownerKey = randomstr(32);
		this.seatMap = new Map;
	}

	toJSON() {
		return {
			id: this.id,
			salt: this.salt,
			roles: this.roles
		};
	}


	/**
	 * Set roles into this engine
	 * @param {Role[]} roles
	 */
	setRoles(roles) {
		this.cards = [];
		this.roles = [];

		for (let role of roles) {
			this.cards.push(game.createCard(role));
			this.roles.push(role);
		}

		shuffle(this.cards);
		for (let card of this.cards) {
			card.onShuffled(this);
		}
	}

	/**
	 * Arrange cards
	 */
	arrangeCards() {
		let seat_num = this.fetchUnusedCards().length;
		for (let i = 1; i <= seat_num; i++) {
			this.seatMap.set(i, this.fetchCard());
		}
	}

	/**
	 * Fetch unused cards
	 * @return {Card[]}
	 */
	fetchUnusedCards() {
		if (!this.cards) {
			return [];
		}

		return this.cards.filter(card => !card.used);
	}

	/**
	 * Check if a seat exists
	 * @param {number} seat
	 * @return {boolean}
	 */
	hasSeat(seat) {
		return this.seatMap.has(seat);
	}

	/**
	 * Take a seat and register a private key. null is returned if the seat is unavailable
	 * @param {number} seat
	 * @param {*} key
	 */
	takeSeat(seat, key) {
		let card = this.seatMap.get(seat);
		if (!card.ownerKey) {
			card.ownerKey = key;
			return card;
		} else {
			return null;
		}
	}

	/**
	 * Fetch a single unused card and mark it as used
	 * @return {Card}
	 */
	fetchCard() {
		let unused_cards = this.fetchUnusedCards();
		if (unused_cards.length <= 0) {
			return null;
		}

		let index = Math.floor(Math.random() * unused_cards.length);
		let card = unused_cards[index];

		card.used = true;
		return card;
	}

	toJSON() {
		return {
			id: this.id,
			salt: this.salt,
			roles: this.roles.map(role => role.toNum())
		};
	}

}

module.exports = Room;
