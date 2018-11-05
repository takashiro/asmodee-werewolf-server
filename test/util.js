
const http = require('http');
const querystring = require('querystring');

function request(method, api, data = null) {
	return new Promise(function (resolve, reject) {
		let req = http.request({
			method: method,
			host: 'localhost',
			port: 2620,
			path: '/' + api,
		}, res => {
			let trunks = [];

			res.on('data', trunk => {
				trunks.push(trunk);
			});

			res.on('end', () => {
				let result = {
					status: res.statusCode,
					data: Buffer.concat(trunks).toString(),
				};

				if (res.statusCode === 200) {
					try {
						result.data = JSON.parse(result.data);
						resolve(result);
					} catch (error) {
						reject(error);
					}
				} else {
					resolve(result);
				}
			});
		});

		req.on('error', reject);

		if (data) {
			req.write(JSON.stringify(data));
		}
		req.end();
	});
}

function POST(api, data = null) {
	return request('POST', api, data);
}

function GET(api, data = null) {
	if (data) {
		api += '?' + querystring.stringify(data);
	}
	return request('GET', api);
}

function DELETE(api, data = null) {
	if (data) {
		api += '?' + querystring.stringify(data);
	}
	return request('DELETE', api);
}

function arrayCompare(arr1, arr2) {
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

module.exports = {
	request,
	POST,
	GET,
	DELETE,
	arrayCompare,
};
