import fs from 'fs';
import fsp from 'fs/promises';

export class Config {
	socket: number | string;

	lobbyCapacity: number;

	constructor() {
		this.socket = '/var/run/asmodee-werewolf/asmodee-werewolf.sock';
		this.lobbyCapacity = 1000;
	}

	async read(file = 'config.json'): Promise<void> {
		if (!fs.existsSync(file)) {
			return;
		}

		try {
			const content = await fsp.readFile(file, 'utf-8');
			const config = JSON.parse(content);
			Object.assign(this, config);
		} catch (error) {
			// Ignore
		}
	}
}

const config = new Config();
export default config;
