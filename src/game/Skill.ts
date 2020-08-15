import { Role } from '@asmodee/werewolf-core';

import SkillEffect from './SkillEffect';

export default abstract class Skill {
	protected readonly role: Role;

	constructor(role: Role) {
		this.role = role;
	}

	getRole(): Role {
		return this.role;
	}

	abstract createEffects(): SkillEffect<Skill, unknown>[];
}
