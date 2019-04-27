'user strict';
const db = require('../util/mongoUtil');
const nconf = require('nconf');
// player information which used to associate with player and persisted

class PlayerInfo {
	constructor(bone) {
		this._id = bone._id;
		this.name = bone.name;
		this.icon = bone.icon;
		this.motto = bone.motto;
	}
	getId() {
		return this._id;
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
			db.insert(this, this, 'test');
		}
	}
}
module.exports.PlayerInfo = PlayerInfo;