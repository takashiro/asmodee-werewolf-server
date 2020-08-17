export default function takeOne<Element>(...elementLists: Element[][]): Element | undefined {
	const limit = elementLists.map((elementList) => elementList.length).reduce((prev, cur) => prev + cur, 0);
	if (limit <= 0) {
		return;
	}

	let i = Math.floor(Math.random() * limit);
	for (const elements of elementLists) {
		if (i < elements.length) {
			const [one] = elements.splice(i, 1);
			return one;
		}
		i -= elements.length;
		if (i < 0) {
			break;
		}
	}
}
