
function DeclareEnum(){
	let object = {};
	for(let i = 0; i < arguments.length; i++){
		object[arguments[i]] = i;
	}
	return object;
}

const Role = DeclareEnum(
	'Unknown',

	// Team Werewolf
	'Werewolf',
	'AlphaWolf',
	'WhiteAlphaWolf',
	'WolfBeauty',
	'SecretWolf',
	'Demon',

	// Team Villager
	'Villager',
	'Seer',
	'Tamer',
	'Witch',
	'Hunter',
	'Guard',
	'Magician',
	'Idiot',
	'Elder',
	'Knight',
	'Dementor',
	'Rogue',
	'Crow',

	// Others
	'Cupid',
	'FeralChild',
	'Thief',
	'Bombman',

	'MaxLimit'
);

Role.isWerewolf = function(role) {
	return Role.Unknown < role && role < Role.Villager;
};

module.exports = Role;
