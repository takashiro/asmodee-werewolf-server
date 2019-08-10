
const Team = require('./Team');
const Role = require('./Role');

class RoleCard {

	constructor(role, team) {
		this.role = role;
		this.team = team;
	}

	static fromRole(role) {
		return cards[role];
	}

	static toTeam(role) {
		return cards[role].team;
	}

	static isValid(role) {
		return Boolean(role && cards[role]);
	}

}

const cards = [
	new RoleCard(Role.Unknown, Team.Unknown),

	new RoleCard(Role.Werewolf, Team.Werewolf),
	new RoleCard(Role.AlphaWolf, Team.Werewolf),
	new RoleCard(Role.WhiteAlphaWolf, Team.Werewolf),
	new RoleCard(Role.WolfBeauty, Team.Werewolf),
	new RoleCard(Role.SecretWolf, Team.Werewolf),
	new RoleCard(Role.Demon, Team.Werewolf),
	new RoleCard(Role.Villager, Team.Villager),
	new RoleCard(Role.Seer, Team.Villager),
	new RoleCard(Role.Tamer, Team.Villager),
	new RoleCard(Role.Witch, Team.Villager),
	new RoleCard(Role.Hunter, Team.Villager),
	new RoleCard(Role.Guard, Team.Villager),
	new RoleCard(Role.Magician, Team.Villager),
	new RoleCard(Role.Idiot, Team.Villager),
	new RoleCard(Role.Elder, Team.Villager),
	new RoleCard(Role.Knight, Team.Villager),
	new RoleCard(Role.DreamWeaver, Team.Villager),
	new RoleCard(Role.Rogue, Team.Villager),
	new RoleCard(Role.Crow, Team.Villager),
	new RoleCard(Role.Cupid, Team.Other),
	new RoleCard(Role.FeralChild, Team.Other),
	new RoleCard(Role.Thief, Team.Other),
	new RoleCard(Role.Bombman, Team.Other),
	new RoleCard(Role.Gargoyle, Team.Werewolf),
	new RoleCard(Role.GraveyardKeeper, Team.Villager),
	new RoleCard(Role.Tiangou, Team.Werewolf),
	new RoleCard(Role.Luna, Team.Villager),
	new RoleCard(Role.WolfGrandma, Team.Werewolf),
	new RoleCard(Role.RedHat, Team.Villager),
	new RoleCard(Role.Doppelganger, Team.Other),
	new RoleCard(Role.Revenger, Team.Other),
	new RoleCard(Role.Hybrid, Team.Other),
];

module.exports = RoleCard;
