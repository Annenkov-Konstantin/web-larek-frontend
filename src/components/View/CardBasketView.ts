import { ItemBasket } from '../../types';
import { IEvents } from '../base/events';
import { CardView } from './CardView';
import { ensureElement } from '../../utils/utils';

export enum CardBasketViewEvents {
	ButtonDeleteClecked = 'buttonDelete:clicked',
}

export class CardBasketView<ItemBasket> extends CardView<ItemBasket> {
	protected quantityItemsElement: HTMLSpanElement;
	protected buttonDeleteElement: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.quantityItemsElement = ensureElement(
			'.basket__item-index',
			this.container
		);
		this.buttonDeleteElement = ensureElement(
			'.basket__item-delete',
			this.container
		) as HTMLButtonElement;

		this.buttonDeleteElement.addEventListener('click', () => {
			this.events.emit(CardBasketViewEvents.ButtonDeleteClecked, {
				id: this.cardId,
			});
		});
	}

	setNumberInList(value: number) {
		this.quantityItemsElement.textContent = String(value);
	}
}
