import { CardView } from './CardView';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { checkBasket } from '../..';

export enum ModalCardViewEvents {
	CardPreviewButtonClicked = 'cardPreviewButton:clicked',
}

const replacements: Record<string, string> = {
	'софт-скил': 'card__category_soft',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export class ModalCardView<T> extends CardView<T> {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLSpanElement;
	protected descriptionElement: HTMLParagraphElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.imageElement = ensureElement(
			'.card__image',
			this.container
		) as HTMLImageElement;

		this.categoryElement = ensureElement('.card__category', this.container);

		this.descriptionElement = ensureElement(
			'.card__text',
			this.container
		) as HTMLParagraphElement;

		this.buttonElement = ensureElement(
			'.card__button',
			this.container
		) as HTMLButtonElement;

		this.buttonElement.addEventListener('click', () => {
			this.events.emit(ModalCardViewEvents.CardPreviewButtonClicked, {
				id: this.cardId,
				source: 'modal',
			});
		});
	}

	set image(src: string) {
		this.imageElement.src = src;
	}

	set category(value: string) {
		this.categoryElement.textContent = value;

		const text = this.categoryElement.textContent;
		const categoryClass =
			text in replacements
				? replacements[text as keyof typeof replacements]
				: 'card__category_other';

		// Устанавливаем базовые классы + категорийный класс
		this.categoryElement.className = `card__category ${categoryClass}`;

		this.buttonState();
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	// Переопределяем сеттер price
	public override set price(value: number | null) {
		// сначала выполняем «базовый» рендер цены
		super.price = value;
		// потом добавляем свою логику для кнопки
		if (!value) {
			this.buttonElement.setAttribute('disabled', '');
			this.buttonElement.textContent = 'Недоступно';
		}
	}

	buttonState(): void {
		checkBasket(this.cardId) ? this.buttonToDelete() : this.buttonToBuy();
		if (this.buttonElement.hasAttribute('disabled')) {
			this.buttonElement.removeAttribute('disabled');
		}
	}

	buttonToBuy(): void {
		this.buttonElement.textContent = 'Купить';
	}

	buttonToDelete(): void {
		this.buttonElement.textContent = 'Удалить из корзины';
	}
}
