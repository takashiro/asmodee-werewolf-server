
const http = require('http');
const querystring = require('querystring');

class HttpClient {

	constructor(port) {
		this.port = port;
	}

	post(api, params, data) {
		if (data === undefined) {
			data = params;
			params = undefined;
		}
		return this.request('POST', api, params, data);
	}

	get(api, params) {
		return this.request('GET', api, params);
	}

	delete(api, params) {
		return this.request('DELETE', api, params);
	}

	request(method, api, params, data) {
		if (params) {
			api += '?' + querystring.stringify(params);
		}

		let port = this.port;
		return new Promise(function (resolve, reject) {
			let req = http.request({
				method: method,
				host: 'localhost',
				port: port,
				path: '/' + api,
			}, res => {
				if (res) {
					resolve(res);
				} else {
					reject();
				}
			});

			req.on('error', reject);

			if (data) {
				req.write(JSON.stringify(data));
			}
			req.end();
		});
	}

}

module.exports = HttpClient;
