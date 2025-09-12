import { FormView } from './FormView';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export enum OrderFormEvents {
	PaymentChoosed = 'paymentButton:clicked',
	AddressInputChanged = 'addressInput:changed',
	Submit = 'orderForm:submit',
}

export class OrderFormView<IOrderForm> extends FormView<IOrderForm> {
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cardButton = this.form.querySelector(
			'button[name="card"]'
		) as HTMLButtonElement;
		if (!this.cardButton) {
			console.log('Кнопка выбора card не найдена');
		}

		this.cashButton = this.form.querySelector(
			'button[name="cash"]'
		) as HTMLButtonElement;
		if (!this.cashButton) {
			console.log('Кнопка выбора cash не найдена');
		}

		this.addressInput = this.form.elements.namedItem(
			'address'
		) as HTMLInputElement | null;
		if (!this.addressInput) {
			console.log('Инпут address не найден');
		}

		this.submitButton = ensureElement(
			'.order__button',
			this.form
		) as HTMLButtonElement;
		if (!this.submitButton) {
			console.log('Кнопка submit не найдена');
		}

		if (this.cardButton) {
			this.cardButton.addEventListener('click', () => {
				this.events.emit(OrderFormEvents.PaymentChoosed, { payment: 'card' });
			});
		} else {
			console.log(
				'cardButton не найдена, событие click OrderFormEvents.PaymentChoosed не эмитировано'
			);
		}

		if (this.cashButton) {
			this.cashButton.addEventListener('click', () => {
				this.events.emit(OrderFormEvents.PaymentChoosed, { payment: 'cash' });
			});
		} else {
			console.log(
				'cashButton не найдена, событие click OrderFormEvents.PaymentChoosed не эмитировано'
			);
		}

		if (this.addressInput) {
			this.addressInput.addEventListener('input', () => {
				this.events.emit(OrderFormEvents.AddressInputChanged, {
					address: this.addressInput.value,
				});
			});
		} else {
			console.log(
				'addressInput не найден, событие input OrderFormEvents.AddressInputChanged не эмитировано'
			);
		}

		if (this.form) {
			this.form.addEventListener('submit', () => {
				this.events.emit(OrderFormEvents.Submit, {
					address: this.addressInput.value,
				});
			});
		} else {
			console.log(
				'Форма не найдена, событие submit OrderFormEvents.Submit не эмитировано'
			);
		}
	}

	set card(cardPayment: boolean) {
		this.cardButton.classList.add('button_alt-active');
		this.cashButton.classList.remove('button_alt-active');
	}

	set cash(cashPayment: boolean) {
		this.cashButton.classList.add('button_alt-active');
		this.cardButton.classList.remove('button_alt-active');
	}

	clearForm(): void {
		this.form.reset();
		if (this.cashButton.classList.contains('button_alt-active')) {
			this.cashButton.classList.remove('button_alt-active');
		} else if (this.cardButton.classList.contains('button_alt-active')) {
			this.cardButton.classList.remove('button_alt-active');
		}
	}
}
