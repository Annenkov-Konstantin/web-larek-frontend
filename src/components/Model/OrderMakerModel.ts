import { IOrderMakerModel, IOrderModel } from '../../types';
import { IEvents } from '../base/events';

export enum OrderModelEvents {
	OrderPaymentSet = 'payment:set',
}

export class OrderMakerModel implements IOrderMakerModel {
	protected _orderPayment: IOrderModel['payment'];
	protected isPaymentValid: boolean;
	protected events: IEvents;

	constructor(events: IEvents) {
		this._orderPayment = '';
		this.events = events;
		this.isPaymentValid = false;
	}

	setPayment(value: IOrderModel['payment']): void {
		if (value) {
			this._orderPayment = value;
			this.isPaymentValid = true;
		}
		this.events.emit(OrderModelEvents.OrderPaymentSet, {
			[this._orderPayment]: true,
		});
	}

	getPaymentState(): boolean {
		return this.isPaymentValid;
	}

	getOrder(): IOrderModel['payment'] {
		return this._orderPayment;
	}

	clearOrdeData(): void {
		this._orderPayment = '';
		this.isPaymentValid = false;
	}
}
