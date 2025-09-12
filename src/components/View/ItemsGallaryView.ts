import { ComponentView } from '../base/ComponentView';

interface ICardsContainer {
	catalog: HTMLElement[];
}

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
