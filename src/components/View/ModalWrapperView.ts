import { ensureElement } from '../../utils/utils';
import { ComponentView } from '../base/ComponentView';
import { IEvents } from '../base/events';

export enum ModalWrapperEvents {
	CloseButtonClicked = 'modalButton:clicked',
}

export class ModalWrapperView extends ComponentView<HTMLElement> {
	protected closeButton: HTMLButtonElement;
	protected contentElement: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.closeButton = ensureElement(
			'.modal__close',
			this.container
		) as HTMLButtonElement;
		this.contentElement = ensureElement(
			'.modal__content',
			this.container
		) as HTMLElement;
		this.events = events;

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

	insertContentAndDisplay(content: Node): void {
		this.contentElement.append(content);
		this.container.classList.add('modal_active');
	}

	closemodalWrapperAndClear(): void {
		this.container.classList.remove('modal_active');
		this.contentElement.innerHTML = '';
	}
}
