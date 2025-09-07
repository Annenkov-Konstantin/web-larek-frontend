import { IOrderModel, IOrderMakerModel, Payment } from '../types';
import { IEvents } from './base/events';

export enum OrderModelEvents {
	OrderDataCreated = 'order:created',
}

export class OrderMakerModel implements IOrderMakerModel {
	protected _order: IOrderModel;
	protected events: IEvents;

	constructor(events: IEvents) {
		this._order = {
			payment: '',
			totalPrice: 0,
			items: [],
		};
		this.events = events;
	}

	setOrderData(orderData: IOrderModel): void {
		if (orderData) {
			Object.assign(this._order, orderData);
			this.events.emit(OrderModelEvents.OrderDataCreated);
		}
	}

	get order(): IOrderModel {
		return this._order;
	}
}
