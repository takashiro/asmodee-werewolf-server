
const Timing = require('../game/Timing');
const Role = require('../game/Role');
const Team = require('../game/Team');
const RoleCard = require('../game/RoleCard');
const Skill = require('../game/Skill');

/**
 * Take one element by random
 * @param {*[]} arr
 * @return {*}
 */
function takeOne(arr) {
	let i = Math.floor(Math.random() * arr.length);
	return arr.splice(i, 1)[0];
}

/**
 * Thief takes 2 more cards (they cannot be 2 werewolves).
 */
class ThiefShuffleCard extends Skill {

	constructor() {
		super(Timing.ShuffleCards, Role.Thief);
	}

	triggerable(room, target) {
		return room && !target;
	}

	effect(room, target, config) {
		let thieves = config.roles.filter(role => role === this.role);

		let roles = config.roles.filter(role => role !== this.role);
		if (roles.length < thieves.length * 2) {
			return false;
		}

		let extraCards = new Array(thieves.length);
		for (let i = 0; i < thieves.length; i++) {
			let villagers = roles.filter(role => RoleCard.toTeam(role) !== Team.Werewolf);
			if (villagers.length <= 0) {
				return false;
			}
			let card1 = takeOne(villagers);

			let werewolves = roles.filter(role => RoleCard.toTeam(role) === Team.Werewolf);
			roles = [...villagers, ...werewolves];
			let card2 = takeOne(roles);

			extraCards[i] = [card1, card2];
		}

		roles.push(...thieves);

		config.thiefExtraCards = extraCards;
		config.roles = roles;
		config.playerNum = roles.length;

		return false;
	}

}

class ThiefDrawCard extends Skill {

	constructor() {
		super(Timing.DrawCard, Role.Thief);
	}

	effect(room, target, config) {
		if (config.thiefExtraCards) {
			let cards = config.thiefExtraCards;
			if (cards.length > 0) {
				target.thiefExtraCards = cards.shift();
			}
		}
	}

}

class ThiefTakeSeat extends Skill {

	constructor() {
		super(Timing.TakeSeat, Role.Thief);
	}

	effect(room, target, data) {
		data.cards = [0, 0];
		if (target.thiefExtraCards) {
			data.cards = target.thiefExtraCards;
		}
	}

}

module.exports = [ThiefShuffleCard, ThiefDrawCard, ThiefTakeSeat];
