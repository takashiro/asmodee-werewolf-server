
const App = require('./core/App');

// Load configurations
let config = (function () {
	let configFile = './config.json';
	for (let argv of process.argv) {
		if (argv.startsWith('--config=')) {
			configFile = argv.substr(9);
		}
	}
	try {
		return require(configFile);
	} catch (e) {
		return {};
	}
})();

// Start up application
(async function () {
	const app = new App(config);
	await app.start();
	console.log('started');
})();
