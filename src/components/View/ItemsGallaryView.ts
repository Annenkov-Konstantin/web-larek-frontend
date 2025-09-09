import { ComponentView } from '../base/ComponentView';
import { ItemGallery, ItemBasket } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { ItemCardView } from './ItemCardView';

interface ICardsContainer {
	catalog: HTMLElement[];
}



//export type DisplayItemsElements = Pick<IItemClicked, 'category' | 'price'>;

export class ItemsGallaryView<
	ICardsContainer
> extends ComponentView<ICardsContainer> {
	protected _catalog: HTMLElement;

	constructor(containerToPasteGalary: HTMLElement) {
		super(containerToPasteGalary);
	}
	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}
