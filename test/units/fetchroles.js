
const assert = require('assert');
const UnitTest =  require('../UnitTest');

const Role = require('../../game/Role');

class FetchRolesTest extends UnitTest {

	constructor() {
		super('Fetch roles');
	}

	async run() {
		let roles = [];
		for (let i = 0; i < 10; i++) {
			let role = Role.enums[Math.floor(Math.random() * Role.enums.length)];
			roles.push(role.toNum());
		}

		await this.post('room', {roles});
		let room = await this.getJSON();

		await this.get('roles', {id: room.id + 1});
		await this.assertError(404, 'The room does not exist');

		await this.get('roles', {id: room.id});
		await this.assertError(403, 'Invalid owner key');

		await this.get('roles', {id: room.id, ownerKey: room.ownerKey});
		let room_roles = await this.getJSON();
		for (let {seat, card} of room_roles) {
			assert(roles.indexOf(card.role) >= 0);
		}

		await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await this.assertJSON({id: room.id});
	}

}

module.exports = FetchRolesTest;
