'use strict';
const assert = require('assert');
const UnitTest = require('../UnitTest');
const mongo = require('../../util/mongoUtil');

class mongoTest extends UnitTest {
	constructor() {
		super('Test mongodb utility function.');
	}
	async run() {
		try { 
			await mongo.init();
			let res = await mongo.find({id: 123}, 'xtest');
			await mongo.insert({id:123, name: 'mongod'}, {id:123, name: 'mongod2'}, 'xtest');
			res = await mongo.find({id: 123}, 'xtest');
		} catch(error) {
			console.error(error);
		}

	}
}
module.exports = mongoTest;