
function GET() {
	return {
		roomNum: this.roomManager.size,
		capacity: this.roomManager.capacity,
	};
}

module.exports = {
	GET,
};
