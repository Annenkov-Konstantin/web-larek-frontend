import { ensureElement } from '../utils/utils';
import { ItemsQuantity } from '../types';
import { IEvents } from './base/events';
import { ComponentView } from './base/ComponentView';

interface IHeaderView {
	basketCounter: number;
}

export enum HeaderEvents {
	BusketButtonClicked = 'basketButton:clicked',
}

export class HeaderView extends ComponentView<IHeaderView> {
	protected buttonElement: HTMLButtonElement;
	protected basketCounterElement: HTMLSpanElement;

	constructor(elementToSeach: HTMLElement, events: IEvents) {
		super(events);
		this.container = ensureElement<HTMLElement>(
			'.header__container',
			elementToSeach
		);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.header__basket',
			this.container
		);
		this.basketCounterElement = ensureElement<HTMLSpanElement>(
			'.header__basket-counter',
			this.container
		);
		this.buttonElement.addEventListener('click', () => {
			this.events.emit(HeaderEvents.BusketButtonClicked);
		});
	}

	set basketCounter(quantity: number) {
		this.basketCounterElement.textContent = String(quantity);
	}
}
