'user strict';
const db = require('../util/mongoUtil');
const nconf = require('nconf');
// player information which used to associate with player and persisted

class User {
	constructor(bone) {
		this.id = bone.id;
		this.name = bone.name;
		this.icon = bone.icon;
		this.motto = bone.motto;
	}
	getId() {
		return this.id;
	}
	getName() {
		return this.name;
	}
	getIcon() {
		return this.icon;
	}
	getMotto() {
		this.motto;
	}
	save() {
		if (nconf.get('mongo').enable) {
			db.insert(this, this, nconf.get('mongo').collection);
		}
	}
	async born() {
		let bone = null;
		let id = this.id;
		if (nconf.get('mongo').enable) {
			bone = await db.find({ id }, nconf.get('mongo').collection);
		}
		return bone;
	}
}
module.exports = User;