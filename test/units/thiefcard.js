
const assert = require('assert');
const UnitTest = require('../UnitTest');

const Role = require('../../game/Role');
const Team = require('../../game/Team');

class ThiefCardTest extends UnitTest {

	constructor() {
		super('Test thief card');
	}

	async run() {
		for (let t = 0; t < 10; t++) {
			let roles = [Role.Werewolf, Role.Thief, Role.Villager].map(role => role.toNum());
			await this.post('room', {roles});
			let room = await this.getJSON();
			assert(room.roles.length === 3);

			await this.get('role', {id: room.id, seat: 1, key: Math.floor(Math.random() * 0xFFFF)});
			let my = await this.getJSON();
			assert(my.role === Role.Thief.toNum());

			let cards = my.cards.map(role => Role.fromNum(role));
			assert(cards.length === 2);
			assert(cards.indexOf(Role.Werewolf) >= 0);
			assert(cards.indexOf(Role.Villager) >= 0);

			await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
			await this.assertJSON({id: room.id});
		}

		// Make sure the thief won't take 2 werewolves
		for (let t = 0; t < 10; t++) {
			let roles = [Role.Werewolf, Role.Werewolf, Role.Werewolf, Role.AlphaWolf, Role.Thief, Role.Seer];

			await this.post('room', {roles: roles.map(role => role.toNum())});
			let room = await this.getJSON();

			await this.get('roles', {id: room.id, ownerKey: room.ownerKey});
			let players = await this.getJSON();
			let room_roles = players.map(player => player.card).map(card => Role.fromNum(card.role));
			assert(room_roles.length === roles.length - 2);

			let requested_werewolves = roles.filter(role => role.team === Team.Werewolf);
			let werewolves = room_roles.filter(role => role.team === Team.Werewolf);
			assert(requested_werewolves.length - 1 === werewolves.length);
		}
	}

}

module.exports = ThiefCardTest;
