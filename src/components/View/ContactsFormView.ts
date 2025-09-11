import { FormView } from './FormView';
import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export enum ContactsFormEvents {
	EmailInputChanged = 'emailInput:changed',
	PhoneInputChanged = 'phoneInput:changed',
	Submit = 'contactsForm:submit',
}

type ContactsForm = Pick<IOrderForm, 'spanErrors' | 'buttonState'>;

export class ContactsFormView<ContactsForm> extends FormView<ContactsForm> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.emailInput = this.form.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;

		this.phoneInput = this.form.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;

		this.submitButton = this.form.querySelector(
			'.contacts__button'
		) as HTMLButtonElement;

		if (this.emailInput) {
			this.emailInput.addEventListener('input', () => {
				this.events.emit(ContactsFormEvents.EmailInputChanged, {
					email: this.emailInput.value,
				});
			});
		} else {
			console.log(
				'emailInput не найден, событие input ContactsFormEvents.EmailInputChanged не эмитировано'
			);
		}

		if (this.emailInput) {
			this.emailInput.addEventListener('change', () => {
				this.events.emit(ContactsFormEvents.EmailInputChanged, {
					email: this.emailInput.value,
				});
			});
		} else {
			console.log(
				'emailInput не найден, событие change ContactsFormEvents.EmailInputChanged не эмитировано'
			);
		}

		if (this.phoneInput) {
			this.phoneInput.addEventListener('input', () => {
				this.events.emit(ContactsFormEvents.PhoneInputChanged, {
					phone: this.phoneInput.value,
				});
			});
		} else {
			console.log(
				'phoneInput не найден, событие input ContactsFormEvents.PhoneInputChanged не эмитировано'
			);
		}

		if (this.phoneInput) {
			this.phoneInput.addEventListener('change', () => {
				this.events.emit(ContactsFormEvents.PhoneInputChanged, {
					phone: this.phoneInput.value,
				});
			});
		} else {
			console.log(
				'phoneInput не найден, событие change ContactsFormEvents.PhoneInputChanged не эмитировано'
			);
		}

		
		if (this.form) {
			this.form.addEventListener('submit', () => {
				this.events.emit(ContactsFormEvents.Submit, {
					email: this.emailInput.value,
					phone: this.phoneInput.value,
				});
			});
		} else {
			console.log(
				'Форма не найдена, событие submit ContactsFormEvents.Submit не эмитировано'
			);
		}
	}
}
