import GameEvent from './GameEvent.js';
import EventListener from './EventListener.js';

export default abstract class SkillEffect<ParentType, ParamType> extends EventListener<GameEvent, ParamType> {
	protected parent: ParentType;

	/**
	 * Create a card instance for a role
	 * @param event
	 * @param role
	 */
	constructor(parent: ParentType, event: GameEvent) {
		super(event);
		this.parent = parent;
	}
}
