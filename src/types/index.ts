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
	setCustomerData(userData: Partial<ICustomerModel>): void;
}

export interface IOrderModel extends ICustomerModel {
	payment: 'card' | 'cash' | '';
	total: number;
	items: string[];
}

export interface IOrderMakerModel {
	order: OrderData;
	setTotalPrice(totalPrice: OrderData['total']): void;
	setPayment(value: OrderData['payment']): void;
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

export type OrderData = Pick<IOrderModel, 'payment' | 'total'>;

export type CustomerDataContacts = Pick<ICustomerModel, 'phone' | 'email'>;

export type Email = Pick<ICustomerModel, 'email'>;

export type Phone = Pick<ICustomerModel, 'phone'>;
