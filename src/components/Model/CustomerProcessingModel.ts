import { ICustomerModel, ICustomerProcessingModel } from '../../types';

export class CustomerProcessingModel implements ICustomerProcessingModel {
	protected _customer: ICustomerModel;

	constructor() {
		this._customer = {
			phone: '',
			email: '',
			address: '',
		};
	}

	setCustomerData(userData: Partial<ICustomerModel>): void {
		Object.assign(this._customer, userData);
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
	}
}
