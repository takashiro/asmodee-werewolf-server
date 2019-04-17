'use strict';
const App = require('./core/App');
const logUtil = require('./util/logUtil.js');
const logger = require('log4js').getLogger('asmodee-server');

// Setting log
logUtil.settingLog();
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
		logger.error(`Exception in require configFile in app.js: ${e}`);
		return {};
	}
})();

// Start up application
(async function () {
	const app = new App(config);
	await app.start();
	logger.info('asmodee-werewolf-server started');
})();
