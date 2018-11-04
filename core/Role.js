
const Team = require('./Team');

let RoleValue = 0;

class Role {

	constructor(key, team) {
		this.value = RoleValue++;
		this.key = key;
		this.team = team;
	}

	toNum() {
		return this.value;
	}

	static fromNum(num) {
		if (0 <= num && num < Role.enums.length) {
			return Role.enums[num];
		} else {
			return Role.Unknown;
		}
	}

}

const RoleList = [
	new Role('Unknown', Team.Unknown),

	new Role('Werewolf', Team.Werewolf),
	new Role('AlphaWolf', Team.Werewolf),
	new Role('WhiteAlphaWolf', Team.Werewolf),
	new Role('WolfBeauty', Team.Werewolf),
	new Role('SecretWolf', Team.Werewolf),
	new Role('Demon', Team.Werewolf),
	new Role('Villager', Team.Villager),
	new Role('Seer', Team.Villager),
	new Role('Tamer', Team.Villager),
	new Role('Witch', Team.Villager),
	new Role('Hunter', Team.Villager),
	new Role('Guard', Team.Villager),
	new Role('Magician', Team.Villager),
	new Role('Idiot', Team.Villager),
	new Role('Elder', Team.Villager),
	new Role('Knight', Team.Villager),
	new Role('DreamWeaver', Team.Villager),
	new Role('Rogue', Team.Villager),
	new Role('Crow', Team.Villager),
	new Role('Cupid', Team.Other),
	new Role('FeralChild', Team.Other),
	new Role('Thief', Team.Other),
	new Role('Bombman', Team.Other),
];

for (let role of RoleList) {
	Role[role.key] = role;
}

Role.enums = RoleList;

module.exports = Role;
