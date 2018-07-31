
const App = require('./core/App');

// Load configurations
let config = (function () {
	try {
		return require('./config.json');
	} catch (e) {
		return {};
	}
})();

// Start up application
const app = new App(config);
app.start();
