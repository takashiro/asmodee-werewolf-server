import {
	Role,
	GameConfig,
	Teamship,
	Team,
} from '@asmodee/werewolf-core';

import SkillEffect from '../../game/SkillEffect';
import GameEvent from '../../game/GameEvent';

import takeOne from './takeOne';
import ThiefSkill from '.';

/**
 * Thief takes 2 more cards (they cannot be 2 werewolves).
 */
export default class ThiefShuffleCard extends SkillEffect<ThiefSkill, GameConfig> {
	constructor(parent: ThiefSkill) {
		super(parent, GameEvent.ShuffleCards);
	}

	isTriggerable(config: GameConfig): boolean {
		const { roles } = config;
		return roles.includes(this.parent.getRole()) && config.roles.length >= 3;
	}

	process(config: GameConfig): boolean {
		const thieves: Role[] = [];
		const werewolves: Role[] = [];
		const others: Role[] = [];

		const { roles } = config;
		for (const role of roles) {
			const team = Teamship.get(role);
			if (team === Team.Werewolf) {
				werewolves.push(role);
			} else if (role === Role.Thief) {
				thieves.push(role);
			} else {
				others.push(role);
			}
		}

		if (roles.length < thieves.length * 3 || others.length < thieves.length) {
			return false;
		}

		for (let i = 0; i < thieves.length; i++) {
			const card1 = takeOne(others);
			const card2 = takeOne(others, werewolves);
			if (!card1 || !card2) {
				return false;
			}
			this.parent.addExtraCards([card1, card2]);
		}

		roles.splice(0);
		roles.push(...thieves);
		roles.push(...werewolves);
		roles.push(...others);
		config.playerNum = roles.length;

		return false;
	}
}
