
const fs = require('fs');

const App = require('../core/App');
const net = require('./net');

const testDir = __dirname + '/unit';

fs.readdir(testDir, async (err, files) => {
	if (err) {
		console.error('Failed to load tests.');
		process.exit(1);
		return;
	}

	const port = 10000 + Math.floor(Math.random() * 55536);
	net.port = port;
	const server = new App({
		socket: {
			host: 'localhost',
			port: port,
		},
		maxRoomLimit: 10,
	});
	await server.start();
	console.log('Server is started');

	for (let file of files) {
		let test = require(testDir + '/' + file);
		console.log(test.name + '...');
		try {
			await test.run();
		} catch (error) {
			console.error(error.stack);
			return process.exit(1);
		}
	}

	await server.stop();
	console.log('Server is stopped.');

	console.log('Tests are all finished.');
	process.exit(0);
});
