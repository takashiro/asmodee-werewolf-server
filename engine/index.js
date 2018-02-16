
const Engine = require('../core/Engine');

let engine = new Engine();
engine.loadCards(__dirname);

module.exports = engine;
