
const net = require('./test/net');
const tests = require('./test/units');

(async function () {
	let localDebug = process.argv.some(argv => argv === '--local-debug');
	const App = require('./' + (localDebug ? 'core' : 'test') + '/App');

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
