
let TeamValue = 0;

class Team {

	constructor(key) {
		this.value = TeamValue++;
		this.key = key;
	}

	toNum() {
		return this.value;
	}

	static fromNum(num) {
		if (num >= 0 && num < Team.enums.length) {
			return Team.enums[num];
		} else {
			return Team.Unknown;
		}
	}

}

let TeamList = [
	new Team('Unknown'),
	new Team('Werewolf'),
	new Team('Villager'),
	new Team('Other'),
];

for (let team of TeamList) {
	Team[team.key] = team;
}
Team.enums = TeamList;

module.exports = Team;
