
const http = require('http');
const RoomManager = require('./RoomManager');

const DefaultConfig = {
	host: 'localhost',
	port: 2620,
	maxRoomLimit: 1000,
};

function loadAPI(path) {
	try {
		return require('../api' + path);
	} catch (error) {
	}
}

function readAll(stream) {
	return new Promise(function (resolve, reject) {
		let body = [];

		stream.on('data', chunk => body.push(chunk));

		stream.on('end', () => {
			let input = Buffer.concat(body).toString();
			try {
				let json = JSON.parse(input);
				resolve(json);
			} catch (error) {
				reject(error);
			}
		});

		stream.on('error', reject);
	});
}

async function requestListener(request, response) {
	let handler = loadAPI(request.url);
	if (!handler) {
		response.writeHead(404);
		response.end();
		return;
	}

	try {
		let input = await readAll(request);
		let output = handler.call(this, input);
		if (typeof output === 'number') {
			response.writeHead(output);
			response.end();
		} else if (output) {
			response.writeHead(200);
			if (output.toJSON) {
				output = output.toJSON();
			}
			if (typeof output !== 'string') {
				output = JSON.stringify(output);
			}
			response.end(output);
		} else {
			response.writeHead(200);
			reponse.end();
		}
	} catch (error) {
		response.writeHead(400);
		response.end(error.message);
	}
}

class App {

	constructor(config) {
		this.config = Object.assign({}, DefaultConfig, config);
		this.roomManager = new RoomManager;
		this.server = http.createServer(requestListener.bind(this));
	}

	start() {
		this.server.listen(this.config.port);
	}

}

module.exports = App;
