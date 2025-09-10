import { ComponentView } from '../base/ComponentView';
import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export enum OrderFormEvents {
	PaymentChoosed = 'paymentButton:clicked',
	AddressInputChanged = 'addressInput:changed',
	Submit = 'orderForm:submit',
}

export class OrderFormView<IOrderForm> extends ComponentView<IOrderForm> {
	protected form: HTMLFormElement;
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected addressInput: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected formErrors: HTMLSpanElement;
	protected events: IEvents;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container);
		this.form = this.container as HTMLFormElement;
		this.cardButton = this.form.elements.namedItem(
			'card'
		) as HTMLButtonElement | null;
		this.cashButton = this.form.elements.namedItem(
			'cash'
		) as HTMLButtonElement | null;
		this.addressInput = this.form.elements.namedItem(
			'address'
		) as HTMLInputElement | null;
		this.submitButton = ensureElement(
			'.order__button',
			this.form
		) as HTMLButtonElement;
		this.formErrors = ensureElement('.form__errors', this.form);
		this.events = events;

		this.container.setAttribute('novalidate', '');

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
		});

		this.cardButton.addEventListener('click', () => {
			this.events.emit(OrderFormEvents.PaymentChoosed, { payment: 'card' });
		});

		this.cashButton.addEventListener('click', () => {
			this.events.emit(OrderFormEvents.PaymentChoosed, { payment: 'cash' });
		});

		this.addressInput.addEventListener('change', () => {
			this.events.emit(OrderFormEvents.AddressInputChanged, {
				address: this.addressInput.value,
			});
		});

		this.submitButton.addEventListener('submit', () => {
			this.events.emit(OrderFormEvents.Submit, {
				address: this.addressInput.value,
			});
		});
	}

	set spanErrors(text: string) {
		this.formErrors.textContent = text;
	}

	set buttonState(active: boolean) {
		if (active) {
			this.submitButton.removeAttribute('disabled');
		} else {
			this.submitButton.setAttribute('disabled', '');
		}
	}

	set card(cardPayment: boolean) {
		if (cardPayment) {
			this.cardButton.classList.add('button_alt-active');
		} else {
			this.cardButton.classList.remove('button_alt-active');
		}
	}

	set cash(cashPayment: boolean) {
		if (cashPayment) {
			this.cashButton.classList.add('button_alt-active');
		} else {
			this.cashButton.classList.remove('button_alt-active');
		}
	}

	clear() {
		this.form.reset();
	}
}
