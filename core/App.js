'use strict';
const path = require('path');
const http = require('http');
const querystring = require('querystring');

const Lobby = require('./Lobby');
const HttpError = require('./HttpError');
const logger = require('log4js').getLogger('asmodee-server');
const DefaultConfig = {
	socket: '/var/run/asmodee-werewolf/asmodee-werewolf.sock',
	maxRoomLimit: 1000,
};

/**
 * Read an object from JSON stream
 * @param {ReadableStream} stream
 * @return {Promise<object>}
 */
function readJSON(stream) {
	return new Promise(function (resolve, reject) {
		let trunks = [];

		stream.on('data', function (trunk) {
			trunks.push(trunk);
		});

		stream.on('error', reject);
		stream.on('end', function () {
			let input = Buffer.concat(trunks).toString();
			try {
				input = JSON.parse(input);
			} catch (error) {
				console.error(error);
				input = {};
			}
			resolve(input);
		});
	});
}

/**
 * Handle client requests
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 */
async function requestListener(request, response) {
	// Parse path and query string
	let api = request.url;
	let params = {};
	let q = request.url.indexOf('?');
	if (q >= 0) {
		api = request.url.substr(0, q);
		try {
			params = querystring.parse(request.url.substr(q + 1));
		} catch (error) {
			logger.error('Error happen in querysting parses url');
		}
	}

	// Load API
	let handler = null;
	try {
		handler = require(path.join('..', 'api', api));
	} catch (error) {
		logger.error(`Error in serving api call: ${api}`);
		response.writeHead(404);
		return response.end();
	}

	// Handle improper requests or unexpected errors
	if (!handler) {
		response.writeHead(500);
		return response.end();
	} else if (!handler[request.method]) {
		response.writeHead(400);
		return response.end();
	}

	// Call API
	let output = null;
	try {
		if (request.method === 'POST') {
			let input = await readJSON(request);
			output = handler[request.method].call(this, params, input);
		} else if (request.method === 'GET' || request.method === 'DELETE') {
			output = handler[request.method].call(this, params);
		} else {
			throw new HttpError(405, 'Method not allowed');
		}
	} catch (error) {
		if (error instanceof HttpError) {
			response.writeHead(error.code);
			return response.end(error.message);
		} else {
			logger.error(`${error} happen when try to fullfill the request.`);
			response.writeHead(500);
			return response.end(String(error));
		}
	}

	if (output) {
		response.writeHead(200);
		if (output.toJSON && typeof output.toJSON === 'function') {
			output = output.toJSON();
		}
		if (typeof output !== 'string') {
			output = JSON.stringify(output);
		}
		response.end(output);
	} else {
		response.writeHead(200);
		response.end();
	}
}

class App {

	/**
	 * Create an application
	 * @param {object} config
	 */
	constructor(config) {
		this.config = Object.assign({}, DefaultConfig, config);
		this.lobby = new Lobby(this.config.maxRoomLimit);
		this.server = http.createServer(requestListener.bind(this));
	}

	/**
	 * Start server to accept requests
	 * @return {Promise}
	 */
	start() {
		logger.info(`Starting the server in ${this.config.socket}.`);
		return new Promise((resolve) => {
			this.server.listen(this.config.socket, resolve);
		});
	}

	/**
	 * Shutdown server
	 * @return {Promise}
	 */
	stop() {
		logger.info('Shutting down the server.');
		return new Promise((resolve) => {
			this.server.close(resolve);
		});
	}

}

module.exports = App;
