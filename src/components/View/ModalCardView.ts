import { CardView } from './CardView';
import { IItemModel } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IItemClicked } from '../../types';
//import { DisplayItemsElements } from './ItemsGallaryView';
import { checkBasket } from '../..';

export enum ModalCardViewEvents {
	CardPreviewButtonClicked = 'cardPreviewButton:clicked',
	//CardPreviewCreated = 'cardPreview:created',
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

	buttonState() {
		checkBasket(this.cardId) ? this.buttonDelete() : this.buttonBuy();
	}

	buttonBuy() {
		this.buttonElement.textContent = 'Купить';
	}

	buttonDelete() {
		this.buttonElement.textContent = 'Удалить из корзины';
	}

	clearProperties() {
		this.imageElement.src = '';
		this.categoryElement.textContent = '';
		this.categoryElement.className = 'card__category card__category_other'; // сбросить классы
		this.descriptionElement.textContent = '';
		this.buttonElement.textContent = 'Купить';
		this.buttonElement.removeAttribute('disabled');
	}
}
