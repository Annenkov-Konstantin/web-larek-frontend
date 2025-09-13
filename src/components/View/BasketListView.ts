import { ComponentView } from '../base/ComponentView';
import { IBasketItem } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export enum BasketListViewEvents {
	buttonToOrderClicked = 'buttonToOrderClicked:clicked',
}

export class BasketListView extends ComponentView<IBasketItem> {
	protected basketListElement: HTMLUListElement;
	protected buttonToOrder: HTMLButtonElement;
	protected basketTotalPriceElement: HTMLSpanElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.basketListElement = ensureElement(
			'.basket__list',
			this.container
		) as HTMLUListElement;
		this.buttonToOrder = ensureElement(
			'.basket__button',
			this.container
		) as HTMLButtonElement;
		this.basketTotalPriceElement = ensureElement(
			'.basket__price',
			this.container
		);

		this.buttonToOrder.addEventListener('click', () => {
			this.events.emit(BasketListViewEvents.buttonToOrderClicked);
		});
	}

	set totalPrice(value: number) {
		this.basketTotalPriceElement.textContent = String(value) + ' синапсов';
		if (this.basketTotalPriceElement.textContent === '0 синапсов') {
			this.buttonToOrder.setAttribute('disabled', '');
		}
	}

	set item(item: HTMLLIElement[]) {
		this.basketListElement.replaceChildren(...item);
	}
}
