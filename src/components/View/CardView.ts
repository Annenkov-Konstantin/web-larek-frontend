import { ComponentView } from '../base/ComponentView';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { ItemBasket } from '../../types';

export abstract class CardView<ItemBasket> extends ComponentView<ItemBasket> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLSpanElement;
	protected cardId: string;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.titleElement = ensureElement('.card__title', this.container);
		this.priceElement = ensureElement('.card__price', this.container);
		this.events = events;
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set id(id: string) {
		this.cardId = id;
	}

	get id() {
		return this.cardId;
	}

	public set price(value: number | null) {
		// общая логика: показываем текст
		if (value === null) {
			this.priceElement.textContent = 'Бесценно';
		} else {
			this.priceElement.textContent = `${value} синапсов`;
		}
	}
}
