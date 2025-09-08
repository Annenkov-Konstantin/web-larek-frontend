import { CardView } from './base/CardView';
import { IItemModel } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { DisplayItemsElements } from './ItemsGallaryView';

export enum ModalCardViewEvents {
	CardPreviewButtonClicked = 'cardPreviewButton:clicked',
	//CardPreviewCreated = 'cardPreview:created',
}

export class ModalCardView<IItemModel> extends CardView<IItemModel> {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLSpanElement;
	protected descriptionElement: HTMLParagraphElement;
	protected buttonElement: HTMLButtonElement;
	protected styleCategoryByDefault: string;
	protected priceTextByDefault: string;
	protected buttonTextContentByDefault: string;
	protected buttonStateByDefault: string;

	constructor(templateContainer: HTMLTemplateElement, events: IEvents) {
		super(templateContainer, events);
		this.imageElement = ensureElement(
			'.card__image',
			this.container
		) as HTMLImageElement;
		this.categoryElement = ensureElement('.card__category', this.container);
		this.styleCategoryByDefault = this.categoryElement.className;
		this.descriptionElement = ensureElement(
			'.card__text',
			this.container
		) as HTMLParagraphElement;
		this.buttonElement = ensureElement(
			'.card__button',
			this.container
		) as HTMLButtonElement;
		this.buttonTextContentByDefault = this.buttonElement.textContent;
		this.priceTextByDefault = this.priceElement.textContent;

		this.buttonElement.addEventListener('click', () => {
			this.events.emit(ModalCardViewEvents.CardPreviewButtonClicked, {
				cardId: this.id,
			});
		});
		//----------
		console.log('Модальная вкладка создана');
		//----------
	}

	set image(src: string) {
		this.imageElement.src = src;
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	getItem(
		itemObject: Record<'price', number | null> & Partial<IItemModel>,
		properties: DisplayItemsElements
	): HTMLElement {
		const itemData = this.render(itemObject);
		this.priceElement.textContent = properties.price;
		if (itemObject.price === null) {
			this.buttonElement.setAttribute('disabled', '');
			this.buttonElement.textContent = 'Недоступно';
		}
		if (
			!(
				this.categoryElement.classList.contains('card__category_other') &&
				this.categoryElement.textContent === 'другое'
			)
		) {
			this.categoryElement.classList.replace(
				'card__category_other',
				properties.category
			);
		}
		/* 		this.events.emit(ModalCardViewEvents.CardPreviewCreated, {
			card: itemData,
		}); */
		console.log(this.buttonTextContentByDefault);

		return itemData;
	}

	clearProperties() {
		this.categoryElement.className = this.styleCategoryByDefault;
		this.priceElement.textContent = this.priceTextByDefault;
		this.buttonElement.textContent = this.buttonTextContentByDefault;
		this.buttonElement.removeAttribute('disabled');
	}
}
