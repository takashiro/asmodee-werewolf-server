
const http = require('http');

function request(method, api, data = null) {
	return new Promise(function (resolve, reject) {
		let req = http.request({
			method: method,
			port: 2620,
			path: api,
		}, res => {
			let trunks = [];

			res.on('data', trunk => {
				trunks.push(trunk);
			});

			res.on('end', () => {
				let reply = Buffer.concat(trunks).toString();
				try {
					let json = JSON.parse(reply);
					resolve(json);
				} catch (error) {
					reject(error);
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

function post(api, data = null) {
	return request('POST', api, data);
}

function array_compare(arr1, arr2) {
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
	post,
	array_compare,
};
