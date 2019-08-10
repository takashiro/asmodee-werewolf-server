
class Player {

	constructor(seat) {
		this.seat = seat;
		this.roles = [];
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

	getRoles() {
		return this.roles;
	}

	addRole(role) {
		this.roles.push(role);
	}

	removeRole(role) {
		const i = this.roles.indexOf(role);
		if (i >= 0) {
			this.roles.splice(i, 1);
		}
	}

	hasRole(role) {
		return this.roles.includes(role);
	}

	getProfile() {
		const profile = {
			seat: this.seat,
			roles: this.roles,
		};
		if (this.roles.length === 1) {
			profile.role = this.roles[0];
		}
		return profile;
	}

}

module.exports = Player;
