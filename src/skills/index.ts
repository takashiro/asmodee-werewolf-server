import Skill from '../game/Skill';

import ThiefSkill from './Thief';

type SkillCreator = new() => Skill;

const skills: SkillCreator[] = [
	ThiefSkill,
];

export default skills;
