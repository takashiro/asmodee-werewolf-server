
const HttpClient = require('./util/HttpClient');
const UnitTest = require('./util/UnitTest');

let server = null;

before(async function () {
	let localDebug = process.argv.some(argv => argv === '--local-debug');
	const App = require((localDebug ? '../core' : './util') + '/App');

	// Start server application
	const port = 10000 + Math.floor(Math.random() * 55536);
	server = new App({
		socket: {
			host: 'localhost',
			port: port,
		},
		maxRoomLimit: 10,
	});
	await server.start();

	// Initialize HTTP client
	let client = new HttpClient(port);
	// Initialize Unit Test
	global.self = new UnitTest(client);
});

after(async function () {
	// Stop server application
	await server.stop();
});
