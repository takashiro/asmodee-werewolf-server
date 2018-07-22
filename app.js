
const http = require('http');

const Room = require('./core/Room');
const RoomManager = require('./core/RoomManager');

const roomManager = new RoomManager;

const handlers = {
	createroom: input => {
		if (!input.roles || !(input.roles instanceof Array)) {
			return 400;
		}

		if (input.roles.length > 50) {
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
		room.arrangeCards();

		if (!roomManager.add(room)) {
			return 400;
		}

		let info = room.toJSON();
		info.ownerKey = room.ownerKey;
		return info;
	},

	enterroom: input => {
		if (!input.id) {
			return 400;
		}

		let id = parseInt(input.id, 10);
		if (isNaN(id)) {
			return 400;
		}

		let room = roomManager.get(id);
		if (!room) {
			return {id : 0};
		}

		return room;
	},

	fetchroles: input => {
		let room = handlers.enterroom(input);
		if (!(room instanceof Room)) {
			return room;
		}

		if (room.ownerKey != input.ownerKey) {
			return {error: 'INVALID_OWNERKEY'};
		}

		let seats = [];
		for (let [seat, card] of room.seatMap) {
			seats.push({
				seat: seat,
				card: card.toJSON()
			});
		}
		return seats;
	},

	fetchrole: input => {
		let room = handlers.enterroom(input);
		if (!(room instanceof Room)) {
			return room;
		}

		if (room.id <= 0) {
			return {error: 'ROOM_EXPIRED'};
		}

		let seat = parseInt(input.seat, 10);
		if (isNaN(seat) || !room.hasSeat(seat)) {
			return {error: 'INVALID_SEAT'};
		}

		let key = parseInt(input.key, 10);
		if (isNaN(key) || !key) {
			return {error: 'INVALID_SEATKEY'};
		}

		let card = room.takeSeat(seat, key);
		if (!card) {
			return {error: 'SEAT_TAKEN'};
		}

		return card;
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
			if (typeof result == 'number') {
				response.writeHead(result);
				response.end();
			} else if (result) {
				response.writeHead(200);
				if (result.toJSON) {
					result = result.toJSON();
				}
				if (typeof result != 'string') {
					result = JSON.stringify(result);
				}
				response.end(result);
			}
		} else {
			response.writeHead(400);
			response.end();
		}
	});
});

server.listen(2620);
