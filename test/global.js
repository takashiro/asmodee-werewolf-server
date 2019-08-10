
const HttpClient = require('./test/HttpClient');

(async function () {
	let localDebug = process.argv.some(argv => argv === '--local-debug');
	const App = require('./' + (localDebug ? 'core' : 'test') + '/App');

	// Start server application
	const port = 10000 + Math.floor(Math.random() * 55536);
	const server = new App({
		socket: {
			host: 'localhost',
			port: port,
		},
		maxRoomLimit: 10,
	});
	await server.start();
	console.log('Server is started');

	// Initialize HTTP client
	let client = new HttpClient(port);

	// Run tests
	const tests = require('./test/units');
	for (let UnitTest of tests) {
		let test = new UnitTest;
		test.setClient(client);
		console.log(test.name + '...');
		await test.run();
	}

	// Stop server application
	await server.stop();
	console.log('Server is stopped.');

	console.log('Tests are all finished.');
	process.exit(0);
})();
