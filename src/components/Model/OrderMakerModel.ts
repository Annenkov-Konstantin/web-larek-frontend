import {
	IOrderMakerModel,
	IOrderModel,
	IBasketItem,
	ICustomerModel,
	IFinalOrderData,
} from '../../types';
import { IEvents } from '../base/events';

export enum OrderModelEvents {
	OrderDataCreated = 'order:created',
	OrderPaymentSet = 'payment:set',
}

export class OrderMakerModel implements IOrderMakerModel {
	protected _orderPayment: IOrderModel['payment'];
	protected events: IEvents;

	constructor(events: IEvents) {
		this._orderPayment = '';
		this.events = events;
	}

	setPayment(value: IOrderModel['payment']): void {
		if (value) {
			this._orderPayment = value;
		} else {
			this._orderPayment = '';
		}
		this.events.emit(OrderModelEvents.OrderPaymentSet, { payment: true });
	}

	checkForm(firstValue: string, secondValue: string) {
		return firstValue.length > 0 && secondValue.length > 0;
	}

	createOrdeData(
		itemsList: string[],
		totalPrice: IBasketItem['totalPrice'],
		customerData: ICustomerModel
	): IFinalOrderData {
		const order = {
			payment: this._orderPayment,
			email: customerData.email,
			phone: customerData.phone,
			address: customerData.address,
			total: totalPrice,
			items: itemsList,
		};
		if (order) {
			return order;
		} else {
			console.log('Заказ не сформирован');
		}
	}

	/* 	get order(): IOrderModel['payment'] {
		return this._orderPayment;
	} */

	clearOrdeData(): void {
		this._orderPayment = '';
	}
}
