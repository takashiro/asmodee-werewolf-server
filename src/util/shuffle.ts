import { randomInt } from 'crypto';

/**
 * Shuffle an array in place
 * @param a
 */
export default function shuffle<Element>(a: Element[]): void {
	for (let i = a.length - 1; i > 0; i--) {
		const j = randomInt(0, i + 1);
		const x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
}
