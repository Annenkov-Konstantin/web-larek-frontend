import { ICustomerModel, ICustomerProcessingModel } from '../types';
import { IEvents } from './base/events';

export enum CustomerModelEvents {
	CustomerDataChanged = 'customerData:changed',
}

export class CustomerProcessingModel implements ICustomerProcessingModel {
	protected _customer: ICustomerModel;
	protected events: IEvents;

	constructor(events: IEvents) {
		this._customer = {
			phone: '',
			email: '',
			address: '',
		};
		this.events = events;
	}

	setCustomerdata(userData: Partial<ICustomerModel>): void {
		if (userData) {
			Object.assign(this._customer, userData);
			this.events.emit(CustomerModelEvents.CustomerDataChanged);
		}
	}

	get data(): ICustomerModel {
		return this._customer;
	}
}
