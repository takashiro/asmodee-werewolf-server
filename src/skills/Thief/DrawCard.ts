import GameEvent from '../../game/GameEvent';
import Skill from '../../game/SkillEffect';
import Player from '../../game/Player';

import ThiefSkill from '.';

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
