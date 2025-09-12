import { CardView } from './CardView';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { checkBasket } from '../..';

export enum ModalCardViewEvents {
	CardPreviewButtonClicked = 'cardPreviewButton:clicked',
}

const softToSpecific: Record<string, string> = {
	'софт-скил': 'card__category_soft',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export class ModalCardView<IItemClicked> extends CardView<IItemClicked> {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLSpanElement;
	protected descriptionElement: HTMLParagraphElement;
	protected buttonElement: HTMLButtonElement;
	protected thisUsed: boolean;

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

		this.thisUsed = false;

		this.buttonElement.addEventListener('click', () => {
			this.events.emit(ModalCardViewEvents.CardPreviewButtonClicked, {
				id: this.cardId,
			});
		});
	}

	set image(src: string) {
		this.imageElement.src = src;
	}

	set category(value: string) {
		this.categoryElement.textContent = value;

		const newClass = softToSpecific[value];
		if (
			newClass &&
			this.categoryElement.classList.contains('card__category_other')
		) {
			this.categoryElement.classList.replace('card__category_other', newClass);
		}
		this.buttonState();
		this.thisUsed = true;
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	// Переопределяем сеттер price
	public override set price(value: number | null) {
		// сначала выполняем «базовый» рендер цены
		super.price = value;

		// потом добавляем свою логику для кнопки
		if (value === null) {
			this.buttonElement.setAttribute('disabled', '');
			this.buttonElement.textContent = 'Недоступно';
		}
	}

	buttonState(): void {
		checkBasket(this.cardId) ? this.buttonToDelete() : this.buttonToBuy();
	}

	buttonToBuy(): void {
		this.buttonElement.textContent = 'Купить';
	}

	buttonToDelete(): void {
		this.buttonElement.textContent = 'Удалить из корзины';
	}

	isUsed(): boolean {
		return this.thisUsed;
	}

	clearProperties(): void {
		this.imageElement.src = '';
		this.categoryElement.textContent = '';
		this.categoryElement.className = 'card__category card__category_other'; // сбросить классы
		this.descriptionElement.textContent = '';
		this.buttonElement.textContent = 'Купить';
		this.buttonElement.removeAttribute('disabled');
		this.thisUsed = false;
		this.titleElement.textContent = '';
		this.cardId = '';
		this.priceElement.textContent = '';
	}
}
