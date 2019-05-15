'use strict';
const UnitTest = require('../UnitTest');
const mongo = require('../../util/mongoUtil');
const nconf = require('nconf');

class mongoTest extends UnitTest {
	constructor() {
		super('Test mongodb utility function.');
	}
	async run() {
		if (nconf.get('mongo').enabled)
			try {
				await mongo.init();
				let res = await mongo.find({ id: 123 }, 'xtest');
				await mongo.insert({ id: 123, name: 'mongod' }, { id: 123, name: 'mongod2' }, 'xtest');
				res = await mongo.find({ id: 123 }, 'xtest');
			} catch (error) {
				console.error(error);
			}

	}
}
module.exports = mongoTest;
