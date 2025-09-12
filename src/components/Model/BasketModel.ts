import { IEvents } from '../base/events';
import { IBasketModel, ItemBasket } from '../../types';

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

	removeItem(id: string): void {
		const itemIndex = this._itemsList.findIndex((item) => item.id === id);
		if (itemIndex !== -1) {
			const item = this._itemsList[itemIndex];
			this._itemsList.splice(itemIndex, 1);
			this.events.emit(BasketModelEvents.ItemDeleted);
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

	getTotalPrice(): number {
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
