
const engine = require('../engine');

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

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

let next_room_id = 1;


class Room {

	constructor() {
		this.id = next_room_id;
		next_room_id++;
		this.salt = randomstr(8);
		this.seatMap = new Map();
		this.ownerKey = randomstr(32);
	}

	setRoles(roles) {
		this.cards = [];
		this.roles = [];

		for (let role of roles) {
			this.cards.push(engine.createCard(role));
			this.roles.push(role);
		}

		shuffle(this.cards);
		for (let card of this.cards) {
			card.onShuffled(this);
		}
	}

	arrangeCards() {
		let seat_num = this.fetchUnusedCards().length;
		for (let i = 1; i <= seat_num; i++) {
			this.seatMap.set(i, this.fetchCard());
		}
	}

	fetchUnusedCards() {
		if (!this.cards) {
			return [];
		}

		return this.cards.filter(card => !card.used);
	}

	hasSeat(seat) {
		return this.seatMap.has(seat);
	}

	takeSeat(seat, key) {
		let card = this.seatMap.get(seat);
		if (!card.key) {
			card.key = key;
			return card;
		} else {
			return null;
		}
	}

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
			roles: this.roles
		};
	}
}

module.exports = Room;
