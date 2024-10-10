import {
	Role,
	GameConfig,
	Teamship,
	Team,
} from '@asmodee/werewolf-core';

import SkillEffect from '../../game/SkillEffect.js';
import GameEvent from '../../game/GameEvent.js';

import ThiefSkill from './index.js';

/**
 * Thief takes 2 more cards, which cannot be both werewolves.
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
		const { roles } = config;
		const teams: Team[] = roles.map((role) => Teamship.get(role) ?? Team.Unknown);

		// Since roles are already shuffled, simply take the first 2 cards (except Thief).
		for (const role of roles) {
			if (role !== Role.Thief) {
				continue;
			}

			const m = roles.findIndex((role, index) => role !== Role.Thief && teams[index] !== Team.Werewolf);
			if (m < 0) {
				break;
			}
			const card1 = roles[m];
			roles.splice(m, 1);

			const n = roles.findIndex((role) => role !== Role.Thief);
			if (n < 0) {
				break;
			}
			const card2 = roles[n];
			roles.splice(n, 1);

			this.parent.addExtraCards([card1, card2]);
		}

		config.playerNum = roles.length;
		return false;
	}
}
