
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

class App {

	/**
	 * Create an application
	 * @param {object} config
	 */
	constructor(config) {
		this.config = config;
	}

	/**
	 * Start up the application
	 * @return {Promise}
	 */
	async start() {
		const configFile = path.resolve(__dirname, './temp/config.json');
		await writeFile(configFile, JSON.stringify(this.config));
		const app = spawn('node', ['app', '--config=' + configFile]);
		this.process = app;
		return new Promise(function (resolve, reject) {
			const appout = readline.createInterface({input: app.stdout});
			appout.once('line', function (message) {
				if (message === 'started') {
					resolve();
				} else {
					reject(new Error(message));
				}
			});
			const apperr = readline.createInterface({input: app.stderr});
			apperr.once('line', function (message) {
				reject(new Error(message));
			});
		});
	}

	/**
	 * Stop the application
	 */
	stop() {
		if (this.process) {
			this.process.kill();
		}
	}

}

module.exports = App;
