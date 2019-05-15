
'use strict';
const User = require('../house/User');
const HttpError = require('../core/HttpError');

function POST(param) {
	if (!param.id) {
		throw new HttpError(400, 'No user id');
	}
	let id = parseInt(param.id, 10);
	if (!param.id) {
		throw new HttpError(400, 'No user name');
	}
	let name = param.name;
	let icon = param.icon;
	let motto = param.motto;
	let user = new User({ id, name, icon, motto });
	user.save();
}

async function GET(param) {
	if (!param.id) {
		throw new HttpError(400, 'No user id');
	}

	let id = parseInt(param.id, 10);
	if (isNaN(id)) {
		throw new HttpError(400, 'Invalid user id');
	}
	let user = await (new User({ id }).born());
	return user;
}



module.exports = {
	POST,
	GET
};
