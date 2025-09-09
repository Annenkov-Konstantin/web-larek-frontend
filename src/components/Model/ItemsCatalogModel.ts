import { IItemModel, IItemsCatalogModel, ItemBasket } from '../../types';
import { IEvents } from '../base/events';
import { CDN_URL } from '../../utils/constants';

export enum CatalogModelEvents {
	Initialized = 'catalog:initialized',
	ItemSelected = 'item:selected',
}

export class ItemsCatalogModel implements IItemsCatalogModel {
	protected _catalog: IItemModel[];
	protected _selectedItem: IItemModel;
	protected events: IEvents;

	constructor(events: IEvents) {
		this._catalog = [];
		this.events = events;
	}

	processImagesSrc(catalog: IItemModel[]): IItemModel[] {
		catalog.forEach((item) => {
			const image = item.image;
			item.image = CDN_URL + image;
		});
		return catalog;
	}

	set catalog(catalog: IItemModel[]) {
		this._catalog = this.processImagesSrc(catalog);
		//---------
		console.log(
			'Каталог товаров инициализирован и установлен url для картинок'
		);
		//---------
		this.events.emit(CatalogModelEvents.Initialized);
	}

	get catalog(): IItemModel[] {
		return this._catalog;
	}

	setSelectedItem(id: string) {
		const itemIndex = this._catalog.findIndex((item) => item.id === id);
		if (itemIndex !== -1) {
			this._selectedItem = this._catalog[itemIndex];
			//----------
			console.log('Карточка выбрана и сохранена: ' + this._selectedItem.title);
			//----------
			this.events.emit(CatalogModelEvents.ItemSelected);
		} else {
			console.log('Нет товара с таким id!');
		}
	}

	clearSelectedItem() {
		this._selectedItem = null;
	}

	get selectedItem(): IItemModel {
		console.log('Карточка сохранена и отправлена');
		return this._selectedItem;
	}

	getItem(id: string): ItemBasket {
		const itemIndex = this._catalog.findIndex((item) => item.id === id);
		if (itemIndex !== -1) {
			const item = this._catalog[itemIndex];
			return {
				id: item.id,
				title: item.title,
				price: item.price,
			};
		} else {
			console.log('Нет товара с таким id!');
		}
	}
}
