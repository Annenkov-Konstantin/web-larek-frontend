import { IEvents } from './events';

export abstract class ComponentView<T> {
	protected container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
