
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
	'WolfKing',
	'WhiteWolfKing',
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

let WerewolfRoles = [
	Role.Werewolf,
	Role.WolfKing,
	Role.WhiteWolfKing,
	Role.WolfBeauty,
	Role.SecretWolf,
	Role.Demon
];

Role.isWerewolf = function(role) {
	return WerewolfRoles.indexOf(role) >= 0;
};

module.exports = Role;
