'use strict';
const MongoClient = require('mongodb').MongoClient;
const logger = require('log4js').getLogger('asmodee-server');
const nconf = require('nconf');


const mongoConfig = nconf.get('mongo');
const url = mongoConfig.url;
let interval = null;
let _db = null;
const _init = async function () {
	if (mongoConfig.enable) {
		const client = new MongoClient(url, { useNewUrlParser: true });
		// Use connect method to connect to the Server
		await client.connect();
		_db = client.db(mongoConfig.db);
	}
};

const _destroy = () => {
	if (_db) {
		_db.close();
	}
	logger.info('disconnect from mongoDB.');
};

const _find = async (doc, colle) => {
	return _db.collection(colle).find(doc).toArray();
};
const _insert = async (oldDoc, newDoc, colle) => {

	let res = await _find(newDoc, colle);
	if (res.length === 0) {
		await _db.collection(colle).insertOne(newDoc);
	} else {
		let res = await _db.collection(colle).findOneAndUpdate(oldDoc, { $set: newDoc }, {
			returnOriginal: true,
			upsert: true
		});
	}

};
const _getDB = () => {
	return _db;
};
module.exports.destroy = _destroy;
module.exports.init = _init;
module.exports.insert = _insert;
module.exports.find = _find;
module.exports.getDB = _getDB;
