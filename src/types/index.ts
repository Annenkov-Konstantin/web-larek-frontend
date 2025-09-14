export interface IItemModel {
	id: string;
	title: string;
	image: string;
	category: string;
	description: string;
	price: number | null;
}

export interface IItemsCatalogModel {
	catalog: IItemModel[];
	selectedItem: IItemModel;
	processImagesSrc(catalog: IItemModel[]): IItemModel[];
	setSelectedItem(id: string): void;
	clearSelectedItem(): void;
	getItem(id: string): ItemBasket;
}

export interface IBasketModel {
	itemsList: ItemBasket[];
	addItem(item: ItemBasket): void;
	removeItem(id: string, options: { source: 'modal' | 'basket' }): void;
	getQuantity(): number;
	getItemsId(): string[];
	getTotalPrice(): number;
	clearBasket(): void;
}

export interface IBasketItem {
	totalPrice: number;
	item: HTMLLIElement[];
}

export interface ICustomerModel {
	phone: string;
	email: string;
	address: string;
}

export interface ICustomerProcessingModel {
	data: ICustomerModel;
	clearCustomerData(): void;
}

export interface IOrderModel extends ICustomerModel {
	payment: 'card' | 'cash' | '';
}

export interface IItemEventPayload extends ItemsId {
	source: 'modal' | 'basket';
}

export interface IOrderMakerModel {
	setPayment(value: IOrderModel['payment']): void;
	clearOrdeData(): void;
}

export interface IOrderForm {
	spanErrors: string;
	buttonState: boolean;
	card?: boolean;
	cash?: boolean;
}

export interface ISuccess {
	success: number;
}

export interface ResponseSuccess {
	total: number;
	id: string;
}

export type ItemsId = Pick<IItemModel, 'id'>;

export type FinalOrderData = ICustomerModel &
	IOrderModel &
	Record<'total', number> &
	Record<'items', string[]>;

export type ItemsQuantity = ReturnType<IBasketModel['getQuantity']>;

export type ClickedGallaryItem = { item: string };

export type ItemBasket = Pick<IItemModel, 'id' | 'title' | 'price'>;

export type Payment = Pick<IOrderModel, 'payment'>;

export type Address = Pick<ICustomerModel, 'address'>;

export type Email = Pick<ICustomerModel, 'email'>;

export type Phone = Pick<ICustomerModel, 'phone'>;
