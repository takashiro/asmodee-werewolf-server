import EventListener from './EventListener';

export default class EventDriver<EventType> {
	protected listeners: Map<EventType, EventListener<EventType, unknown>[]>;

	constructor() {
		this.listeners = new Map();
	}

	register(listener: EventListener<EventType, unknown>): void {
		const listeners = this.listeners.get(listener.event);
		if (!listeners) {
			this.listeners.set(listener.event, [listener]);
		} else {
			listeners.push(listener);
		}
	}

	/**
	 * Trigger skills on a player
	 * @param event
	 * @param data
	 */
	trigger<ParamType>(event: EventType, data: ParamType): void {
		const listeners = this.listeners.get(event);
		if (!listeners) {
			return;
		}

		for (const listener of listeners) {
			if (!listener.isTriggerable(data)) {
				continue;
			}

			const prevented = listener.process(data);
			if (prevented) {
				break;
			}
		}
	}
}
