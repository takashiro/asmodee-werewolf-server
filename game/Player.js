'use strict';
const User = require('../house/User');
class Player {

	constructor(seat) {
		this.seat = seat;
		this.role = null;
		this.seatKey = null;
		this.user = null;
	}

	getSeat() {
		return this.seat;
	}

	setSeat(seat) {
		this.seat = seat;
	}

	getSeatKey() {
		return this.seatKey;
	}

	setSeatKey(seatKey) {
		this.seatKey = seatKey;
	}

	getRole() {
		return this.role;
	}

	setRole(role) {
		this.role = role;
	}
	getUser() {
		return this.user;
	}
	setUser(user) {
		this.user = new User(user);
	}
	save() {
		this.user.save();
	}

}

module.exports = Player;
