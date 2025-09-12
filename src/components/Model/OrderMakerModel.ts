import { IOrderModel, IOrderMakerModel, OrderData } from '../../types';
import { IEvents } from '../base/events';
import { ItemsId } from '../../types';

export enum OrderModelEvents {
	OrderDataCreated = 'order:created',
}

export class OrderMakerModel implements IOrderMakerModel {
	protected _order: OrderData;
	protected events: IEvents;

	constructor(events: IEvents) {
		this._order = {
			payment: '',
			total: 0,
		};
		this.events = events;
	}

	setPayment(value: OrderData['payment']) {
		this._order.payment = value;
	}

	setTotalPrice(totalPrice: OrderData['total']): void {
		this._order.total = totalPrice;
		this.events.emit(OrderModelEvents.OrderDataCreated);
	}

	get order(): OrderData {
		return this._order;
	}

	clearOrdeData() {
		this._order = {
			payment: '',
			total: 0,
		};
	}
}
