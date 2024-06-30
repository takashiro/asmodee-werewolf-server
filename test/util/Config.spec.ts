import {
	beforeAll,
	expect,
	it,
	jest,
} from '@jest/globals';
import fs from 'fs';
import fsp from 'fs/promises';

import { Config } from '../../src/util/config.js';

let existsSync: jest.SpiedFunction<typeof fs['existsSync']>;
let readFile: jest.SpiedFunction<typeof fsp['readFile']>;

beforeAll(() => {
	existsSync = jest.spyOn(fs, 'existsSync');
	readFile = jest.spyOn(fsp, 'readFile');
});

const config = new Config();

it('has default values', () => {
	expect(config.lobbyCapacity).toBe(1000);
	expect(config.socket).toBe('/var/run/asmodee-werewolf/asmodee-werewolf.sock');
});

it('reads a non-existing configuration file', async () => {
	await config.read('This is a test');
	expect(readFile).not.toBeCalled();
});

it('reads a configuration file', async () => {
	await config.read('test/sample/config.json');
	expect(config.lobbyCapacity).toBe(20);
});

it('reads from config.json by default', async () => {
	existsSync.mockReturnValueOnce(true);
	readFile.mockRejectedValueOnce(new Error('invalid'));
	await config.read();
	expect(existsSync).toBeCalledWith('config.json');
});
