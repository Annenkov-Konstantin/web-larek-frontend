import { ComponentView } from '../base/ComponentView';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IComponentView } from '../base/ComponentView';

export abstract class FormView<T> extends ComponentView<T> {
	protected form: HTMLFormElement;
	protected formErrors: HTMLSpanElement;
	protected submitButton: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container);

		this.form = this.container as HTMLFormElement;
		if (!this.form) {
			console.log('Форма не найдена');
		}
		this.formErrors = ensureElement('.form__errors', this.form);
		if (!this.formErrors) {
			console.log('Элемент ошибок не найден');
		}

		this.events = events;
		if (!this.events) {
			console.log('Объект событий не найден');
		}

		this.form.setAttribute('novalidate', '');

		this.form.addEventListener('submit', (evt) => {
			evt.preventDefault();
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

	/* 	updateSubmitButton(buttonState: boolean, form: IComponentView) {
		form.render({ buttonState });
	} */
}
