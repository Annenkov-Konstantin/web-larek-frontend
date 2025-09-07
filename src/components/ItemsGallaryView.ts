import { CardView } from './base/CardView';
import { ItemGallery, ItemBasket } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export enum GalleryViewEvents {
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
			itemData.addEventListener('click', () => {
				this.events.emit(GalleryViewEvents.GalleryButtonClicked, {
					cardId: item.id,
				});
			});
			this.elementForGalary.append(itemData);
		});
	}
}
