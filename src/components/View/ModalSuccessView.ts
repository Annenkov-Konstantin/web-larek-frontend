import { ensureElement } from '../../utils/utils';
import { ComponentView } from '../base/ComponentView';
import { ISuccess } from '../../types';
import { IEvents } from '../base/events';

export enum SuccessEvents {
	SuccessButtonClicked = 'successButton:clicked',
}

export class ModallSuccessView extends ComponentView<ISuccess> {
	protected buttonSuccess: HTMLButtonElement;
	protected descriptionElement: HTMLParagraphElement;
	protected events: IEvents;

	constructor(container: HTMLDivElement, events: IEvents) {
		super(container);

		this.buttonSuccess = ensureElement(
			'.order-success__close',
			this.container
		) as HTMLButtonElement;

		this.descriptionElement = ensureElement(
			'.order-success__description',
			this.container
		) as HTMLParagraphElement;

		this.events = events;
		this.buttonSuccess.addEventListener('click', () => {
			this.events.emit(SuccessEvents.SuccessButtonClicked);
		});
	}

	set success(value: number) {
		if (value > 0) {
			this.descriptionElement.textContent = `Списано ${String(value)} синапсов`;
		}
	}
}
