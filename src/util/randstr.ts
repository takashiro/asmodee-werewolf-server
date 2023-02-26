import { randomInt } from 'crypto';

/**
 * Generate a random string
 * @param length
 * @return
 */
export default function randstr(length: number): string {
	let str = '';
	for (let i = 0; i < length; i++) {
		let rand = randomInt(0, 62);
		if (rand >= 0 && rand <= 25) {
			rand += 0x41;
		} else if (rand <= 51) {
			rand -= 26;
			rand += 0x61;
		} else {
			rand -= 52;
			rand += 0x30;
		}
		str += String.fromCharCode(rand);
	}
	return str;
}
