
const Engine = require('../game/Engine');

/**
 * Generate a random string
 * @param {number} length
 * @return {string}
 */
function randomstr(length){
	let str = '';
	for(let i = 0; i < length; i++){
		let rand = Math.floor(Math.random() * 62);
		if(rand >= 0 && rand <= 25){
			rand += 0x41;
		}else if(rand <= 51){
			rand -= 26;
			rand += 0x61;
		}else{
			rand -= 52;
			rand += 0x30;
		}
		str += String.fromCharCode(rand);
	}

	return str;
}

class Room {

	constructor() {
		this.id = 0;
		this.salt = randomstr(8);
		this.ownerKey = randomstr(32);
		this.engine = new Engine;
		this.timer = null;
	}

	getEngine() {
		return this.engine;
	}

	toJSON() {
		return {
			id: this.id,
			salt: this.salt,
			...this.engine.toJSON(),
		};
	}

	setTimer(timer) {
		this.timer = timer;
	}

	destroy() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

}

module.exports = Room;
