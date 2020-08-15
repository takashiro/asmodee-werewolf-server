import {
	Role,
	PlayerProfile,
} from '@asmodee/werewolf-core';

export default class Player {
	protected readonly seat: number;

	protected roles: Role[];

	protected seatKey?: string;

	constructor(seat: number) {
		this.seat = seat;
		this.roles = [];
	}

	getSeat(): number {
		return this.seat;
	}

	getSeatKey(): string | undefined {
		return this.seatKey;
	}

	setSeatKey(seatKey: string): void {
		this.seatKey = seatKey;
	}

	getRoles(): Role[] {
		return this.roles;
	}

	addRole(role: Role): void {
		this.roles.push(role);
	}

	removeRole(role: Role): void {
		const i = this.roles.indexOf(role);
		if (i >= 0) {
			this.roles.splice(i, 1);
		}
	}

	hasRole(role: Role): boolean {
		return this.roles.includes(role);
	}

	getProfile(): PlayerProfile {
		const profile = {
			seat: this.seat,
			roles: this.roles,
		};
		return profile;
	}
}
