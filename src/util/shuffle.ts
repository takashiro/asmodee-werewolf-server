/**
 * Shuffle an array in place
 * @param a
 */
export default function shuffle<Element>(a: Element[]): void {
	for (let i = a.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
}
