
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function randomstr(length){
	let str = '';
	for(let i = 0; i < length; i++){
		let rand = Math.floor(Math.random() * 62);
		if(rand >= 0 && rand <= 25){
			rand += 0x41;
		}else if(rand <= 51){
			rand -= 26;
			rand += 0x61;
		}else{
			rand -= 52;
			rand += 0x30;
		}
		str += String.fromCharCode(rand);
	}

	return str;
}

let next_room_id = 1;

function Room() {
	this.id = next_room_id;
	next_room_id++;
	this.salt = randomstr(8);
	this.roles = [];

	let role_map = [];

	this.setRoles = roles => {
		for (let role of roles) {
			role_map.push({
				value: role,
				used: false
			});
			this.roles.push(role);
		}

		shuffle(role_map);
	}

	this.fetchRole = () => {
		let unused_roles = [];
		for (let role of role_map) {
			if (!role.used) {
				unused_roles.push(role);
			}
		}

		if (unused_roles.length <= 0) {
			return 0;
		}

		let index = Math.floor(Math.random() * unused_roles.length);
		let selected = unused_roles[index];

		selected.used = true;
		return selected.value;
	}
}

module.exports = Room;
