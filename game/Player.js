
class Player {

	constructor(seat) {
		this.seat = seat;
		this.role = null;
		this.seatKey = null;
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

}

module.exports = Player;
