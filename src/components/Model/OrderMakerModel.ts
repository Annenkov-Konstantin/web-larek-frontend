import { IOrderModel, IOrderMakerModel, Payment } from '../../types';
import { IEvents } from '../base/events';
import { ItemsId } from '../../types';

export enum OrderModelEvents {
	PaymentWayAdded = 'paymentWay:added',
	OrderDataCreated = 'order:created',
}

export class OrderMakerModel implements IOrderMakerModel {
	protected _order: IOrderModel;
	protected events: IEvents;
	protected items: string[];

	constructor(events: IEvents) {
		this._order = {
			payment: '',
			totalPrice: 0,
			items: [],
		};
		this.events = events;
	}

	setOrderData(orderData: Partial<IOrderModel>): void {
		if (orderData) {
			Object.assign(this._order, orderData);
			this.events.emit(OrderModelEvents.OrderDataCreated);
		}
	}

	setItems(items: string[]) {
		this.items = [...items];
	}

	setPayment(value: IOrderModel['payment']) {
		this._order.payment = value;
	}
	 
	getPayment() {
		return this._order.payment;
	} 

	get order(): IOrderModel {
		Object.assign(this._order, this.items);
		return this._order;
	}
}
