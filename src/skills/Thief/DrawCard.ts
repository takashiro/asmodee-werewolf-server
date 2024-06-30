import GameEvent from '../../game/GameEvent.js';
import Skill from '../../game/SkillEffect.js';
import Player from '../../game/Player.js';

import ThiefSkill from './index.js';

export default class ThiefDrawCard extends Skill<ThiefSkill, Player> {
	constructor(parent: ThiefSkill) {
		super(parent, GameEvent.DrawCard);
	}

	isTriggerable(player: Player): boolean {
		return player.hasRole(this.parent.getRole());
	}

	process(player: Player): boolean {
		const extraCards = this.parent.takeExtraCards();
		if (extraCards) {
			for (const role of extraCards) {
				player.addRole(role);
			}
		}
		return false;
	}
}
