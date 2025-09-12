import { ensureElement } from '../../utils/utils';
import { ComponentView } from '../base/ComponentView';
import { IEvents } from '../base/events';

export enum ModalWrapperEvents {
	CloseButtonClicked = 'modalButton:clicked',
}

export class ModalWrapperView extends ComponentView<HTMLElement> {
	protected closeButton: HTMLButtonElement;
	protected contentElement: HTMLElement;
	protected page: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents, page: HTMLElement) {
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

		this.page = page;

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
		this.contentElement.replaceChildren(content);
		this.container.classList.add('modal_active');
		this.page.classList.add('page__wrapper_locked');
	}

	closemodalWrapperAndClear(): void {
		this.container.classList.remove('modal_active');
		this.contentElement.innerHTML = '';
		this.page.classList.remove('page__wrapper_locked');
	}
}
