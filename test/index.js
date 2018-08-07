
const {spawn} = require('child_process');
const fs = require('fs');

const testDir = __dirname + '/unit';

fs.readdir(testDir, async (err, files) => {
	if (err) {
		console.error('Failed to load tests.');
		process.exit(1);
		return;
	}

	const server = spawn('node', ['app.js'], {cwd: __dirname + '/..'});

	for (let file of files) {
		let test = require(testDir + '/' + file);
		console.log(test.name + '...');
		await test.run();
	}

	server.kill();
});
