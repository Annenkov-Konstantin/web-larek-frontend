interface IItem {
	id: string;
	title: string;
	image: string;
	category: string;
	description: string;
	price: number | null;
}

interface ICustomer {
	phone: string;
	email: string;
	address: string;
	payment: 'card' | 'cash' | '';
}

interface IItemsCatalog {
	catalog: IItem[];
	selectedItem: IItem;
	getCatalog(): IItem[];
	saveSelectedItem(catalog: IItem[]): void;
	getSelectedItem(): IItem;
}

interface IItemsBasket {
	itemsList: ItemBasket[];
	addItem(item: IItem): void;
	removeItem(item: IItem): void;
	getQuantity(): number;
	getItemsList(): ItemBasket[];
	getTotalPrice(): number;
	getAvailability(): boolean;
}

interface IOrder extends ICustomer {
	totalPrice: number;
	items: string[];
}

type ItemsQuantity = ReturnType<IItemsBasket['getQuantity']>;

type ItemGallery = Pick<
	IItem,
	'id' | 'image' | 'category' | 'description' | 'price'
>;
type ItemGalleryArray = ItemGallery[];

type ItemBasket = Pick<IItem, 'id' | 'title' | 'price'>;

type CustomerDataPaymentAddress = Pick<ICustomer, 'payment' | 'address'>;

type CustomerDataContacts = Pick<ICustomer, 'phone' | 'email'>;
