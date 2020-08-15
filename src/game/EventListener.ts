export default abstract class EventListener<EventType, ParamType> {
	readonly event: EventType;

	constructor(event: EventType) {
		this.event = event;
	}

	abstract isTriggerable(data: ParamType): boolean;

	abstract process(data: ParamType): boolean;
}
