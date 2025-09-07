import { IEvents } from './events';

export abstract class ComponentView<T> {
	protected container: HTMLElement;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
