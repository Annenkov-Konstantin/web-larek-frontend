import { IItemModel } from '../../types';
import { CardView } from './CardView';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export enum GalleryViewEvents {
	//ItemsDisplayed = 'itemsGallery:displayed', - не нужно?
	GalleryButtonClicked = 'itemsGalleryButton:clicked',
}

const replacements = {
	'софт-скил': 'card__category_soft',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export class ItemCardView extends CardView<IItemModel> {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLSpanElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.imageElement = ensureElement(
			'.card__image',
			this.container
		) as HTMLImageElement;


		this.categoryElement = ensureElement('.card__category', this.container);

		this.container.addEventListener('click', () => {
			this.events.emit(GalleryViewEvents.GalleryButtonClicked, {
				item: this.cardId
			});
		});
	}

	set image(src: string) {
		this.imageElement.src = src;
	}

	set description(value: string) {
		this.imageElement.alt = value;
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
		const text = this.categoryElement.textContent;
		if (
			text in replacements &&
			this.categoryElement.classList.contains('card__category_soft')
		) {
			this.categoryElement.classList.replace(
				'card__category_soft',
				replacements[text as keyof typeof replacements]
			);
		}
	}
}
