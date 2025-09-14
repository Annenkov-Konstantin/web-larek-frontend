import { ICustomerModel, ICustomerProcessingModel } from '../../types';
import { IEvents } from '../base/events';

export enum CustomerProcessingModelEvents {
	CustomerDataCustomerChanged = 'customerData:changed',
}

export class CustomerProcessingModel implements ICustomerProcessingModel {
	protected _customer: ICustomerModel;
	protected events: IEvents;
	protected isPhoneValid: boolean;
	protected isEmailValid: boolean;
	protected isAddressValid: boolean;

	constructor(events: IEvents) {
		this._customer = {
			phone: '',
			email: '',
			address: '',
		};

		this.events = events;

		this.isPhoneValid = false;
		this.isEmailValid = false;
		this.isAddressValid = false;
	}

	setCustomerData(userData: Partial<ICustomerModel>): void {
		Object.assign(this._customer, userData);

		this.isPhoneValid =
			!!this._customer.phone && this._customer.phone.length > 0;
		this.isEmailValid =
			!!this._customer.email && this._customer.email.length > 0;
		this.isAddressValid =
			!!this._customer.address && this._customer.address.length > 0;

		const changedFields: Record<string, string> = {};

		if ('phone' in userData) {
			changedFields.phone = 'phone';
		}
		if ('email' in userData) {
			changedFields.email = 'email';
		}
		if ('address' in userData) {
			changedFields.address = 'address';
		}

		this.events.emit(
			CustomerProcessingModelEvents.CustomerDataCustomerChanged,
			changedFields
		);
	}

	getIsPhoneValid(): boolean {
		return this.isPhoneValid;
	}

	getIsEmailValid(): boolean {
		return this.isEmailValid;
	}

	getIsAddressValid(): boolean {
		return this.isAddressValid;
	}

	get data(): ICustomerModel {
		return this._customer;
	}

	clearCustomerData(): void {
		this._customer = {
			phone: '',
			email: '',
			address: '',
		};
		this.isPhoneValid = false;
		this.isEmailValid = false;
		this.isAddressValid = false;
	}
}
