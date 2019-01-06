
function arrayEqual(arr1, arr2) {
	if (arr1.length !== arr2.length) {
		return false;
	}

	for (let e of arr1) {
		if (arr2.indexOf(e) < 0) {
			return false;
		}
	}

	return true;
}

module.exports = arrayEqual;
