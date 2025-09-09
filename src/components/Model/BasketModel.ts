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
		//-----
		console.log(`Товар ${item.title} успешно добавлен в корзину`);
		//-----
		this.events.emit(BasketModelEvents.ItemAdded, { id: item.id });
	}

	removeItem(id: string): void {
		const itemIndex = this._itemsList.findIndex((item) => item.id === id);
		if (itemIndex !== -1) {
			const item = this._itemsList[itemIndex];
			this._itemsList.splice(itemIndex, 1);
			//----------
			console.log(`Товар: ${item.title} благополучно удалён из корзины`);
			//----------
			this.events.emit(BasketModelEvents.ItemDeleted, { cardId: item.id });
			return;
		}
	}

	getQuantity(): number {
		return this._itemsList.length;
	}

	get itemsList(): ItemBasket[] {
		return this._itemsList;
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
}
