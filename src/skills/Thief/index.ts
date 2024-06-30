import { Role } from '@asmodee/werewolf-core';

import Skill from '../../game/Skill.js';
import SkillEffect from '../../game/SkillEffect.js';
import ThiefDrawCard from './DrawCard.js';
import ThiefShuffleCard from './ShuffleCard.js';

export default class ThiefSkill extends Skill {
	protected extraCards: Role[][] = [];

	constructor() {
		super(Role.Thief);
	}

	addExtraCards(cards: Role[]): void {
		this.extraCards.push(cards);
	}

	takeExtraCards(): Role[] | undefined {
		if (this.extraCards.length <= 0) {
			return;
		}
		const cards = this.extraCards.shift();
		return cards;
	}

	createEffects(): SkillEffect<ThiefSkill, unknown>[] {
		const drawCard = new ThiefDrawCard(this);
		const shuffleCard = new ThiefShuffleCard(this);
		return [drawCard, shuffleCard];
	}
}
