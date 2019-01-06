
function GET() {
	return {
		roomNum: this.lobby.size,
		capacity: this.lobby.capacity,
	};
}

module.exports = {
	GET,
};
