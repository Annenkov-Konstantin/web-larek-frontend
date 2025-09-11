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
	setSelectedItem(id: string): void;
}

export interface IBasketModel {
	itemsList: ItemBasket[];
	addItem(item: ItemBasket): void;
	removeItem(id: string): void;
	getQuantity(): number;
	getTotalPrice(): number;
}

export interface IItemClicked {
	id: string;
	image: string;
	title: string;
	category: string;
	price: number;
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
	setCustomerdata(userData: Partial<ICustomerModel>): void;
}

export interface IOrderModel {
	payment: 'card' | 'cash' | '';
	totalPrice: number;
	items: string[];
}

export interface IOrderMakerModel {
	order: IOrderModel;
	setOrderData(userData: Partial<IOrderModel>): void;
}

export type ItemsId = Pick<IItemModel, 'id'>;

export type FinalOrderData = ICustomerModel & IOrderModel;

export type ItemsQuantity = ReturnType<IBasketModel['getQuantity']>;

export type ClickedGallaryItem = { item: string };

export type ItemGallery = Pick<
	IItemModel,
	'id' | 'image' | 'category' | 'title' | 'price'
>;

export type ItemGalleryArray = ItemGallery[];

export type ItemBasket = Pick<IItemModel, 'id' | 'title' | 'price'>;

export type BasketList = ItemBasket & { totalQuantity: number };

export type Payment = Pick<IOrderModel, 'payment'>;

export type Address = Pick<ICustomerModel, 'address'>;

export type PaymantAndAdress = Payment | Address;

export interface IOrderForm {
	spanErrors: string;
	buttonState: boolean;
	card?: boolean;
	cash?: boolean;
}

export type CustomerDataContacts = Pick<ICustomerModel, 'phone' | 'email'>;

export type Email = Pick<ICustomerModel, 'email'>;

export type Phone = Pick<ICustomerModel, 'phone'>;