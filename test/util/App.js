
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const util = require('util');
const os = require('os');

const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

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
		const id = Math.floor(Math.random() * 0xFFFFFF);
		this.configFile = path.join(os.tmpdir(), `asmodee-werewolf-${id}.config.json`);
		await writeFile(this.configFile, JSON.stringify(this.config));
		const app = spawn('node', ['app', '--config=' + this.configFile]);
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
	async stop() {
		if (this.process) {
			this.process.kill();
		}
		if (this.configFile) {
			unlink(this.configFile);
			this.configFile = null;
		}
	}

}

module.exports = App;
