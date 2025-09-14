import { IEvents } from '../base/events';
import { IBasketModel, ItemBasket, IBasketItem } from '../../types';

export enum BasketModelEvents {
	ItemAdded = 'item:added',
	ItemDeleted = 'item:deleted',
}

export class BasketModel implements IBasketModel {
	protected _itemsList: ItemBasket[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this._itemsList = [];
		this.events = events;
	}

	addItem(item: ItemBasket): void {
		this._itemsList.push(item);
		this.events.emit(BasketModelEvents.ItemAdded);
	}

	removeItem(id: string, options: { source: 'modal' | 'basket' }): void {
		const itemIndex = this._itemsList.findIndex((item) => item.id === id);
		if (itemIndex !== -1) {
			this._itemsList.splice(itemIndex, 1);
			this.events.emit(BasketModelEvents.ItemDeleted, {
				id,
				source: options?.source,
			});
			return;
		}
	}

	getQuantity(): number {
		return this._itemsList.length;
	}

	get itemsList(): ItemBasket[] {
		return this._itemsList;
	}

	getItemsId(): string[] {
		const itemsId = this._itemsList.map((item) => {
			const itemId = item.id;
			return itemId;
		});
		return itemsId;
	}
	
	getTotalPrice(): IBasketItem['totalPrice'] {
		if (this._itemsList.length > 0) {
			const totalPrice = this._itemsList.reduce((previousPrice, item) => {
				return previousPrice + +item.price;
			}, 0);
			return totalPrice;
		} else {
			return 0;
		}
	}

	clearBasket(): void {
		this._itemsList = [];
	}
}
