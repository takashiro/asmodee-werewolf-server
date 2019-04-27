'use strict';
const { PlayerInfo } = require('../house/PlayerInfo');
class Player {

	constructor(seat) {
		this.seat = seat;
		this.role = null;
		this.seatKey = null;
		this.info =  null;
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
	getInfo() {
		return this.info;
	}
	setInfo(info) {
		this.info = new PlayerInfo(info);
	}
	save() {
		this.info.save();
	}

}

module.exports = Player;
