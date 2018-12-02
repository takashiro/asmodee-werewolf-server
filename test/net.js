
const http = require('http');
const querystring = require('querystring');

function request(method, api, data = null) {
	let port = this.port;
	return new Promise(function (resolve, reject) {
		let req = http.request({
			method: method,
			host: 'localhost',
			port: port,
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
	return this.request('POST', api, data);
}

function GET(api, data = null) {
	if (data) {
		api += '?' + querystring.stringify(data);
	}
	return this.request('GET', api);
}

function DELETE(api, data = null) {
	if (data) {
		api += '?' + querystring.stringify(data);
	}
	return this.request('DELETE', api);
}

module.exports = {
	port: 2620,
	request,
	POST,
	GET,
	DELETE,
};
