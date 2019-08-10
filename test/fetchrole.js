
const assert = require('assert');
const UnitTest = require('../UnitTest');

const Role = require('../game/Role');

class FetchRoleTest extends UnitTest {

	constructor() {
		super('Fetch role');
	}

	async run() {
		let roles = [];
		for (let i = 0; i < 10; i++) {
			let role = Role.enums[Math.floor(Math.random() * Role.enums.length)];
			roles.push(role.toNum());
		}

		await this.post('room', {roles});
		let room = await this.getJSON();

		await this.get('role', {id: room.id});
		await this.assertError(400, 'Invalid seat');

		await this.get('role', {id: room.id, seat: roles.length + 1});
		await this.assertError(400, 'Invalid seat');

		await this.get('role', {id: room.id, seat: 3, key: 'test'});
		await this.assertError(403, 'Invalid seat key');

		await this.get('role', {id: room.id, seat: 3, key: Math.floor(Math.random() * 0xFFFF)});
		let my = await this.getJSON();
		assert(roles.indexOf(my.role) >= 0);

		await this.get('role', {id: room.id, seat: 3, key: Math.floor(Math.random() * 0xFFFF)});
		await this.assertError(409, 'The seat has been taken');

		await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await this.assertJSON({id: room.id});
	}

}

module.exports = FetchRoleTest;
