import { randomInt } from 'crypto';
import { ServerStatus } from '@asmodee/werewolf-core';

import Room from './Room.js';

export default class Lobby {
	protected rooms: Map<number, Room>;

	protected timeout: number;

	protected capacity: number;

	constructor(capacity = 1000) {
		this.rooms = new Map();
		this.timeout = 60 * 60 * 1000;
		this.capacity = capacity;
	}

	setCapacity(capacity: number): void {
		this.capacity = capacity;
	}

	getCapacity(): number {
		return this.capacity;
	}

	/**
	 * The number of existing rooms
	 */
	get size(): number {
		return this.rooms.size;
	}

	/**
	 * Add a room
	 * @param room
	 * @return whether the room is successfully added
	 */
	add(room: Room): boolean {
		if (this.rooms.size >= this.capacity) {
			return false;
		}

		const id = this.createRoomId();
		Reflect.set(room, 'id', id);
		this.rooms.set(id, room);

		const timer = setTimeout(() => {
			this.rooms.delete(id);
		}, this.timeout);
		room.setTimer(timer);

		return true;
	}

	/**
	 * @return Judge if a room exists
	 */
	has(id: number): boolean {
		return this.rooms.has(id);
	}

	/**
	 * @return Get a room by id
	 */
	get(id: number): Room | undefined {
		return this.rooms.get(id);
	}

	/**
	 * Delete a room
	 * @return {boolean}
	 */
	delete(id: number): boolean {
		const room = this.rooms.get(id);
		if (room) {
			room.destroy();
			return this.rooms.delete(id);
		}
		return false;
	}

	getStatus(): ServerStatus {
		return {
			roomNum: this.rooms.size,
			capacity: this.capacity,
		};
	}

	/**
	 * @return A random room id
	 */
	protected createRoomId(): number {
		let id = 0;
		const limit = this.getCapacity() * 10;
		do {
			id = randomInt(1, limit);
		} while (this.rooms.has(id));
		return id;
	}
}
