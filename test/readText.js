
/**
 * Read text from a stream
 * @param {Stream} stream
 * @return {Promise<object>} JSON Object
 */
function readText(stream) {
	return new Promise(function (resolve, reject) {
		let body = [];
		stream.on('data', chunk => body.push(chunk));
		stream.on('error', reject);
		stream.on('end', function () {
			let text = Buffer.concat(body).toString();
			resolve(text);
		});
	});
}

module.exports = readText;
