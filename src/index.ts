import './scss/styles.scss';

import { API_URL, errorMessage } from './utils/constants';

import { ApiListResponse, Api } from './components/base/api';

import { EventEmitter } from './components/base/events';

import {
	CatalogModelEvents,
	ItemsCatalogModel,
} from './components/Model/ItemsCatalogModel';

import {
	IItemModel,
	ItemsId,
	ItemBasket,
	ClickedGallaryItem,
	IBasketItem,
	Payment,
	Address,
	Email,
	Phone,
	ResponseSuccess,
	IItemEventPayload,
	ICustomerModel,
	IOrderModel,
	FinalOrderData,
} from './types/index';

import { ensureElement, cloneTemplate } from './utils/utils';

import {
	ItemCardView,
	GalleryViewEvents,
} from './components/View/ItemCardView';

import { ItemsGallaryView } from './components/View/ItemsGallaryView';

import {
	ModalWrapperView,
	ModalWrapperEvents,
} from './components/View/ModalWrapperView';

import {
	ModalCardView,
	ModalCardViewEvents,
} from './components/View/ModalCardView';

import { BasketModel, BasketModelEvents } from './components/Model/BasketModel';

import { HeaderView, HeaderEvents } from './components/View/HeaderView';

import {
	CardBasketView,
	CardBasketViewEvents,
} from './components/View/CardBasketView';

import {
	BasketListView,
	BasketListViewEvents,
} from './components/View/BasketListView';

import {
	OrderMakerModel,
	OrderModelEvents,
} from './components/Model/OrderMakerModel';

import { IComponentView } from './components/base/ComponentView';

import {
	OrderFormView,
	OrderFormEvents,
} from './components/View/OrderFormView';

import {
	CustomerProcessingModel,
	CustomerProcessingModelEvents,
} from './components/Model/CustomerProcessingModel';

import {
	ContactsFormView,
	ContactsFormEvents,
} from './components/View/ContactsFormView';

import {
	ModallSuccessView,
	SuccessEvents,
} from './components/View/ModalSuccessView';

// Главный контейнер страницы
const page: HTMLElement = ensureElement('.page');
const headerContainer = ensureElement<HTMLElement>('.header__container', page);

// Темплейт для заполнения данными для галереи
const galleryTemplate: HTMLTemplateElement =
	page.querySelector('#card-catalog');
// Контейнер-кнопка для отображения товара в галерее
const containerButtonForItem: HTMLElement = cloneTemplate(galleryTemplate);

// Контейнер, где будет располагаться галерея
const containerToPasteGalary: HTMLElement = ensureElement('.gallery', page);

// Темплейт для заполнения обёртки модального окна Preview карты Товара
const previewTemplate: HTMLTemplateElement =
	page.querySelector('#card-preview');
// Контейнер для заполнения обёртки модального окна Preview Товара
const previewContainer: HTMLElement = cloneTemplate(previewTemplate);

// Обёртка для модального окна
const modalWrapper = ensureElement('.modal');

// Темплейт списка модального окна Preview Корзины
const basketTemplate: HTMLTemplateElement = page.querySelector('#basket');
// Контейнер списка модального окна Preview Корзины
const basketContainerElement: HTMLElement = cloneTemplate(basketTemplate);

// Темплейт для заполнения обёртки модального окна Preview Корзины
const basketLiTemplate: HTMLTemplateElement =
	page.querySelector('#card-basket');
// Контейнер для заполнения обёртки модального окна Preview Корзины
const previewItemInList = cloneTemplate(basketLiTemplate);

// Темплейт Формы Заказа
const orderFormTemplate: HTMLTemplateElement = page.querySelector('#order');
// Контейнер для Формы Заказа
const orderFormElement: HTMLFormElement = cloneTemplate(orderFormTemplate);

// Темплейт Формы Контактов
const contactsFormTemplate: HTMLTemplateElement =
	page.querySelector('#contacts');
// Контейнер для Формы Контактов
const contactsFormElement: HTMLFormElement =
	cloneTemplate(contactsFormTemplate);

// Темплейт для заполнения обёртки модального окна Succsess
const successTemplate: HTMLTemplateElement = page.querySelector('#success');
// Контейнер для заполнения обёртки модального окна Succsess
const successElement: HTMLDivElement = cloneTemplate(successTemplate);

// Создание объекта эмиттера
const eventEmitter = new EventEmitter();

// Создание объекта API
const api = new Api(API_URL);

// Создание объекта Модели товаров
const itemsCatalogModel = new ItemsCatalogModel(eventEmitter);

// Создание объекта Отображения товаров на главной странице
const itemsGallaryView = new ItemsGallaryView(containerToPasteGalary);

// Создание объекта Отображения Обёртки Модального окна
const modalWrapperView = new ModalWrapperView(modalWrapper, eventEmitter, page);

// Создание объекта Отображения Preview товара в модальной карточке
const modalCardView = new ModalCardView(previewContainer, eventEmitter);

// Создание объекта Отображения хедера
const headerView = new HeaderView(headerContainer, eventEmitter);

// Создание объекта Модели корзины
const basketModel = new BasketModel(eventEmitter);

// Создание объекта Модели обработки данных покупателя
const customerProcessingModel = new CustomerProcessingModel(eventEmitter);

// Создание объекта Отображения списка Корзины
const basketListView = new BasketListView(basketContainerElement, eventEmitter);

// Создание объекта Модели Заказа товаров
const orderMakerModel = new OrderMakerModel(eventEmitter);

// Создание объекта Формы Заказа
const orderFormView = new OrderFormView(orderFormElement, eventEmitter);

// Создание объекта Формы Контактов
const contactsFormView = new ContactsFormView(
	contactsFormElement,
	eventEmitter
);

// Создание объекта Отображения Success
const modallSuccessView = new ModallSuccessView(successElement, eventEmitter);

export function checkBasket(id: string) {
	const item: ItemBasket[] = basketModel.itemsList;
	const itemExists = item.some((previousItem) => previousItem.id === id);
	return itemExists;
}

function displayBusket() {
	const basketList = basketModel.itemsList.map((item, itemsNumber) => {
		const liElementClone = previewItemInList.cloneNode(true) as HTMLLIElement;
		const itemLiInstant = new CardBasketView(liElementClone, eventEmitter);
		itemLiInstant.setNumberInList(itemsNumber + 1);
		return itemLiInstant.render(item);
	});

	const itemsInBusket: IBasketItem = {
		totalPrice: basketModel.getTotalPrice(),
		item: basketList as HTMLLIElement[],
	};

	return itemsInBusket;
}

function updateSubmitButton(
	firstValue: boolean,
	secondvalue: boolean,
	form: IComponentView
) {
	form.render({
		buttonState: firstValue && secondvalue,
	});
}

function showError(
	value: string,
	endOfMessage: string,
	form: IComponentView,
	state: boolean
): void {
	if (!state) {
		form.render({ spanErrors: value + endOfMessage });
	} else {
		form.render({ spanErrors: '' });
	}
}

// Подписка на первоначальную загрузку и сохранение данных
eventEmitter.on(CatalogModelEvents.Initialized, () => {
	// Получаем массив обработанных и сохранённых данных из модели
	const itemsCatalog: IItemModel[] = itemsCatalogModel.catalog;

	// Передаём в Отображение галереи данные для отрисовки
	const cardsArray = itemsCatalog.map((card) => {
		// Создание карточек в Отображении
		// Клонируем шаблон для каждой карточки
		const containerClone = containerButtonForItem.cloneNode(
			true
		) as HTMLElement;
		const cardInstant = new ItemCardView(containerClone, eventEmitter);
		return cardInstant.render(card);
	});
	itemsGallaryView.render({ catalog: cardsArray });
});

// Подписка на клик по карточке в галерее
eventEmitter.on<ClickedGallaryItem>(
	GalleryViewEvents.GalleryButtonClicked,
	(payload) => {
		const { item } = payload;

		itemsCatalogModel.setSelectedItem(item);
	}
);

// Подписка на событие сохранения выделенного кликнутого товара
eventEmitter.on(CatalogModelEvents.ItemSelected, () => {
	const selectedItem = itemsCatalogModel.selectedItem;

	const readyItem = modalCardView.render(selectedItem);

	modalWrapperView.insertContentAndDisplay(readyItem);
});

// Подписка на событие клика по кнопке закрытия модалки
eventEmitter.on(ModalWrapperEvents.CloseButtonClicked, () => {
	modalWrapperView.closemodalWrapperAndClear();
});

// Подписка на событие клика по кнопке Добавить/Удалить
eventEmitter.on<IItemEventPayload>(
	ModalCardViewEvents.CardPreviewButtonClicked,
	(payload) => {
		const { id, source } = payload;
		const result = checkBasket(id);
		if (result) {
			basketModel.removeItem(id, { source });
		} else {
			basketModel.addItem(itemsCatalogModel.getItem(id));
		}
	}
);

// Подписка на добавление товара
eventEmitter.on<ItemsId>(BasketModelEvents.ItemAdded, () => {
	modalCardView.buttonToDelete();
	headerView.basketCounter = basketModel.getQuantity();
});

// Подписка на удаление товара
eventEmitter.on<IItemEventPayload>(BasketModelEvents.ItemDeleted, (payload) => {
	const { source } = payload;
	if (source === 'modal') {
		modalCardView.buttonToBuy();
	} else if (source === 'basket') {
		const itemsInBusket = displayBusket();
		basketListView.render(itemsInBusket);
	}
	headerView.basketCounter = basketModel.getQuantity();
});

// Подписка на клик по кнопке корзины
eventEmitter.on(HeaderEvents.BusketButtonClicked, function () {
	const itemsInBusket = displayBusket();
	const busketListUlContainer = basketListView.render(itemsInBusket);
	modalWrapperView.insertContentAndDisplay(busketListUlContainer);
});

// Подписка на нажатие кнопки удаления товара из Списка Корзины
eventEmitter.on<IItemEventPayload>(
	CardBasketViewEvents.ButtonDeleteClecked,
	(payload) => {
		const { id, source } = payload;
		basketModel.removeItem(id, { source });
	}
);

// Подписка на событие нажатия кнопки Оформить Список Товаров
eventEmitter.on(BasketListViewEvents.buttonToOrderClicked, () => {
	const orderForm = orderFormView.render();
	modalWrapperView.insertContentAndDisplay(orderForm);
});

// Подписка на событие выбора формы оплаты
eventEmitter.on<Payment>(OrderFormEvents.PaymentChoosed, (payload) => {
	const { payment } = payload;
	orderMakerModel.setPayment(payment);
});

let isPaymentValid = false;
let isAddressValid = false;
let isEmailValid = false;
let isPhoneValid = false;

// Подписка на событие сохранения формы оплаты
eventEmitter.on(
	OrderModelEvents.OrderPaymentSet,
	(payload: Record<string, boolean>) => {
		const paymentKey = Object.keys(payload)[0];
		orderFormView.render({ [paymentKey]: paymentKey });
		isPaymentValid = orderMakerModel.getPaymentState();
		updateSubmitButton(isPaymentValid, isAddressValid, orderFormView);
	}
);

// Подписка на событие сохранения данных Покупателя
eventEmitter.on(
	CustomerProcessingModelEvents.CustomerDataCustomerChanged,
	(payload: Record<string, string>) => {
		let obj = Object.keys(payload)[0];
		let value = payload[obj];
		if (value === 'address') {
			isAddressValid = customerProcessingModel.getIsAddressValid();
			updateSubmitButton(isPaymentValid, isAddressValid, orderFormView);
			showError(errorMessage, ' адрес', orderFormView, isAddressValid);
		} else if (value === 'email') {
			isEmailValid = customerProcessingModel.getIsEmailValid();
			updateSubmitButton(isEmailValid, isPhoneValid, contactsFormView);
			showError(errorMessage, ' имейл', contactsFormView, isEmailValid);
		} else if (value === 'phone') {
			isPhoneValid = customerProcessingModel.getIsPhoneValid();
			updateSubmitButton(isEmailValid, isPhoneValid, contactsFormView);
			showError(
				errorMessage,
				' номер телефона',
				contactsFormView,
				isPhoneValid
			);
		}
	}
);

// Подписка на событие input адреса в форме Заказа
eventEmitter.on<Address>(
	OrderFormEvents.AddressInputChanged,
	(payload: Record<string, string>) => {
		const { address } = payload;
		customerProcessingModel.setCustomerData({ address });
		updateSubmitButton(isPaymentValid, isAddressValid, orderFormView);
		showError(errorMessage, ' адрес', orderFormView, isAddressValid);
	}
);

// Подписка на событие submit формы Заказа
eventEmitter.on(OrderFormEvents.Submit, () => {
	const contactsForm = contactsFormView.render({});
	modalWrapperView.insertContentAndDisplay(contactsForm);
	isPaymentValid = false;
	isAddressValid = false;
});

// Подписка на событие input в поле email формы Контактов
eventEmitter.on<Email>(
	ContactsFormEvents.EmailInputChanged,
	(payload: Record<string, string>) => {
		const { email } = payload;
		customerProcessingModel.setCustomerData({ email });
		updateSubmitButton(isEmailValid, isPhoneValid, contactsFormView);
		showError(errorMessage, ' имейл', contactsFormView, isEmailValid);
	}
);

// Подписка на событие input в поле Номер Телефона формы Контактов
eventEmitter.on<Phone>(ContactsFormEvents.PhoneInputChanged, (payload) => {
	const { phone } = payload;
	customerProcessingModel.setCustomerData({ phone });
	updateSubmitButton(isEmailValid, isPhoneValid, contactsFormView);
	showError(errorMessage, ' номер телефона', contactsFormView, isPhoneValid);
});

enum OrderCreashionEvent {
	OrderDataCreated = 'order:created',
}

function createTheOrder(
	items: string[],
	totalPrice: IBasketItem['totalPrice'],
	customerData: ICustomerModel,
	payment: IOrderModel['payment']
): FinalOrderData {
	return {
		payment: payment,
		email: customerData.email,
		phone: customerData.phone,
		address: customerData.address,
		total: totalPrice,
		items: items,
	};
}

let order: FinalOrderData;

// Подписка на событие submit  формы Контактов
eventEmitter.on(ContactsFormEvents.Submit, () => {
	const items = basketModel.getItemsId();
	const totalPrice = basketModel.getTotalPrice();
	const customer = customerProcessingModel.data;
	const payment = orderMakerModel.getOrder();

	order = createTheOrder(items, totalPrice, customer, payment);
	eventEmitter.emit(OrderCreashionEvent.OrderDataCreated);
});
// Подписка на окончательное создание заказа
eventEmitter.on(OrderCreashionEvent.OrderDataCreated, () => {
	api
		.post('/order', order)
		.then((result: ResponseSuccess) => {
			basketModel.clearBasket();
			headerView.basketCounter = basketModel.getQuantity();
			customerProcessingModel.clearCustomerData();
			orderMakerModel.clearOrdeData();
			orderFormView.clearForm();
			contactsFormView.clearForm();
			isEmailValid = false;
			isPhoneValid = false;
			orderFormView.buttonState = false;
			contactsFormView.buttonState = false;
			modalWrapperView.insertContentAndDisplay(
				modallSuccessView.render({ success: result.total })
			);
		})
		.catch((error) => {
			console.error('Ошибка при POST-запросе:', error);
		});
});

// Подписка на закрытие модального окна Success
eventEmitter.on(SuccessEvents.SuccessButtonClicked, () => {
	modalWrapperView.closemodalWrapperAndClear();
});

// Подключение к серверу для получения данных
api
	.get('/product/')
	.then((data: ApiListResponse<IItemModel>) => {
		// Передача данных в Модель после ответа сервера
		itemsCatalogModel.catalog = data['items'];
	})
	.catch((error) => {
		console.error('Ошибка при GET-запросе:', error);
	});
