interface IItemModel {
	id: string;
	title: string;
	image: string;
	category: string;
	description: string;
	price: number | null;
}

interface ICustomerModel {
	phone: string;
	email: string;
	address: string;
	payment: 'card' | 'cash' | '';
}

interface IItemsCatalogModel {
	catalog: IItemModel[];
	selectedItem: IItemModel;
	getCatalog(): IItemModel[];
	saveSelectedItem(catalog: IItemModel[]): void;
	getSelectedItem(): IItemModel;
}

interface IItemsBasketModel {
	itemsList: ItemBasket[];
	addItem(item: IItemModel): void;
	removeItem(item: IItemModel): void;
	getQuantity(): number;
	getItemsList(): ItemBasket[];
	getTotalPrice(): number;
	getAvailability(): boolean;
}

interface IOrderModel extends ICustomerModel {
	totalPrice: number;
	items: string[];
}

interface IOrderMakerModel {
	order: IOrderModel;
	getOrder(): IOrderModel;
}

type ItemsQuantity = ReturnType<IItemsBasketModel['getQuantity']>;

type ItemGallery = Pick<
	IItemModel,
	'id' | 'image' | 'category' | 'description' | 'price'
>;
type ItemGalleryArray = ItemGallery[];

type ItemBasket = Pick<IItemModel, 'id' | 'title' | 'price'>;

type CustomerDataPaymentAddress = Pick<ICustomerModel, 'payment' | 'address'>;

type CustomerDataContacts = Pick<ICustomerModel, 'phone' | 'email'>;
