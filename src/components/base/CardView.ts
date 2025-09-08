import { ComponentView } from './ComponentView';
import { IEvents } from './events';
import { ensureElement } from '../../utils/utils';
import { ItemTitleAndPrice } from '../../types';
import { cloneTemplate } from '../../utils/utils';

export abstract class CardView<ItemBasket> extends ComponentView<ItemBasket> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLSpanElement;
	protected cardId: string;

	constructor(templateContainer: HTMLTemplateElement, events: IEvents) {
		super(events);
		this.container = cloneTemplate(templateContainer);
		this.titleElement = ensureElement('.card__title', this.container);
		this.priceElement = ensureElement('.card__price', this.container);
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
}
