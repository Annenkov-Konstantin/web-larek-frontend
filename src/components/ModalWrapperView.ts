import { ensureElement } from '../utils/utils';
import { ComponentView } from './base/ComponentView';
import { IEvents } from './base/events';

export enum ModalWrapperEvents {
	CloseButtonClicked = 'modalButton:clicked',
}

export class ModalWrapperView extends ComponentView<HTMLElement> {
	protected closeButton: HTMLButtonElement;
	protected contentElement: HTMLElement;

	constructor(modalWrapper: HTMLElement, events: IEvents) {
		super(events);
		this.container = modalWrapper;
		this.closeButton = ensureElement(
			'.modal__close',
			this.container
		) as HTMLButtonElement;
		this.contentElement = ensureElement(
			'.modal__content',
			this.container
		) as HTMLElement;

		this.closeButton.addEventListener('click', () => {
			this.events.emit(ModalWrapperEvents.CloseButtonClicked);
		});

		// Обработчик клика по фону (оверлею)
		this.container.addEventListener('click', (event) => {
			// Если клик по самому контейнеру, а не по внутреннему контенту
			if (event.target === this.container) {
				this.events.emit(ModalWrapperEvents.CloseButtonClicked);
			}
		});
	}

	insertContentAndDisplay(content: HTMLElement): void {
		this.contentElement.appendChild(content);
		console.log(this.container);
		this.container.classList.add('modal_active');
	}

	closemodalWrapperAndClear(): void {
		this.container.classList.remove('modal_active');
		this.contentElement.innerHTML = '';
		console.log(this.container);
	}
}
