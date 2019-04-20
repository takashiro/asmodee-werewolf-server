const log4js = require('log4js');
function settingLog() {
	if (process.env.NODE_ENV == 'production') {
		log4js.configure('./config/log4js.json'); // production log setting
	} else { // developement log setting
		log4js.configure('./config/log4js.dev.json');
	}
}
module.exports.settingLog = settingLog;
