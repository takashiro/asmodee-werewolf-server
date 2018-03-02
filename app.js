
const http = require('http');

const Room = require('./core/Room');

const rooms = new Map();

const handlers = {
	createroom: input => {
		if (!input.roles || !(input.roles instanceof Array)) {
			return 400;
		}

		let roles = [];
		for (let role of input.roles) {
			role = parseInt(role, 10);
			if (!isNaN(role)) {
				roles.push(role);
			}
		}

		if (roles.length <= 0) {
			return 400;
		}

		let room = new Room();
		room.setRoles(roles);
		rooms.set(room.id, room);

		setTimeout(() => {
			rooms.delete(room.id);
		}, 1000 * 60 * 10);

		return room;
	},

	enterroom: input => {
		if (!input.id) {
			return 400;
		}

		let id = parseInt(input.id, 10);
		if (isNaN(id)) {
			return 400;
		}

		let room = rooms.get(id);
		if (!room) {
			return {id : 0};
		}

		return room;
	},

	fetchrole: input => {
		let room = handlers.enterroom(input);
		if (!isNaN(room)) {
			return room;
		}

		if (room.id <= 0) {
			return {};
		}

		let card = room.fetchCard();
		return card ? card : {};
	}
};

const server = http.createServer((request, response) => {
	let handler = handlers[request.url.substr(1)];
	if (!handler) {
		response.writeHead(404);
		response.end();
		return;
	}

	let body = [];
	request.on('data', chunk => {
		body.push(chunk);
	});
	request.on('end', () => {
		let input = null;
		try {
			input = Buffer.concat(body).toString();
			input = JSON.parse(input);
		} catch (e) {
		}

		if (input) {
			let result = handler(input);
			if (!isNaN(result)) {
				response.writeHead(result);
				response.end();
			} else if (result) {
				response.writeHead(200);
				if (result.toJSON) {
					result = result.toJSON();
				}
				response.end(JSON.stringify(result));
			}
		} else {
			response.writeHead(400);
			response.end();
		}
	});
});

server.listen(2620);
