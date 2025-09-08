import { CardView } from './base/CardView';
import { ItemGallery, ItemBasket } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

const replacements = {
	'софт-скил': 'card__category_soft',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export interface IItemClicked {
	cardId: string;
	category: string;
	price: string;
}

export type DisplayItemsElements = Pick<IItemClicked, 'category' | 'price'>;

export enum GalleryViewEvents {
	//ItemsDisplayed = 'itemsGallery:displayed', - не нужно?
	GalleryButtonClicked = 'basketButton:clicked',
}

export class ItemsGallaryView<ItemGallery> extends CardView<ItemGallery> {
	protected elementForGalary: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLSpanElement;

	constructor(
		templateContainer: HTMLTemplateElement,
		events: IEvents,
		elementForGalary: HTMLElement
	) {
		super(templateContainer, events);
		this.elementForGalary = elementForGalary;
		this.imageElement = ensureElement(
			'.card__image',
			this.container
		) as HTMLImageElement;
		this.categoryElement = ensureElement('.card__category', this.container);
	}

	set price(value: number) {
		this.priceElement.textContent = String(value);
	}

	set image(src: string) {
		this.imageElement.src = src;
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
	}

	displayItems(itemsArray: Array<{ id: string } & Partial<ItemGallery>>) {
		this.elementForGalary.innerHTML = '';
		itemsArray.forEach((item) => {
			const itemData = this.render(item).cloneNode(true) as HTMLElement;

			const category = ensureElement('.card__category', itemData);

			const text = category.textContent;
			if (
				text in replacements &&
				category.classList.contains('card__category_soft')
			) {
				category.classList.replace(
					'card__category_soft',
					replacements[text as keyof typeof replacements]
				);
			}

			const price = ensureElement('.card__price', itemData);

			let priceTextContent = price.textContent;

			//----------
			console.log(priceTextContent);
			//----------

			priceTextContent === 'null'
				? (price.textContent = 'Бесценно')
				: (price.textContent = priceTextContent + ' синапсов');

			itemData.addEventListener('click', () => {
				this.events.emit(GalleryViewEvents.GalleryButtonClicked, {
					cardId: item.id,
					category: replacements[text as keyof typeof replacements],
					price: price.textContent,
				});
			});
			this.elementForGalary.append(itemData);
			//this.events.emit(GalleryViewEvents.ItemsDisplayed); - не нужно?
		});
	}
}
