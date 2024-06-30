import Skill from '../game/Skill.js';

import ThiefSkill from './Thief/index.js';

type SkillCreator = new() => Skill;

const skills: SkillCreator[] = [
	ThiefSkill,
];

export default skills;
