
const App = require('../core/App');
const net = require('./net');

const tests = require('./units');

(async function () {
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

	for (let test of tests) {
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
})();
