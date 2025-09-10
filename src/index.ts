import './scss/styles.scss';

import { API_URL } from './utils/constants';

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
	IItemClicked,
	ClickedGallaryItem,
	BasketList,
	IBasketItem,
	Payment,
} from './types/index';

import { ensureElement, cloneTemplate, createElement } from './utils/utils';

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

import {
	OrderFormView,
	OrderFormEvents,
} from './components/View/OrderFormView';

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

// Темплейт Формы заказа
const orderFormTemplate: HTMLTemplateElement = page.querySelector('#order');
// Контейнер для Формы заказа
const orderFormElement: HTMLFormElement = cloneTemplate(orderFormTemplate);

// Создание объекта эмиттера
const eventEmitter = new EventEmitter();

// Создание объекта API
const api = new Api(API_URL);

// Создание объекта Модели товаров
const itemsCatalogModel = new ItemsCatalogModel(eventEmitter);

// Создание объекта Отображения товаров на главной странице
const itemsGallaryView = new ItemsGallaryView(containerToPasteGalary);

// Создание объекта Отображения Обёртки Модального окна
const modalWrapperView = new ModalWrapperView(modalWrapper, eventEmitter);

// Создание объекта Отображения Preview товара в модальной карточке
const modalCardView = new ModalCardView(previewContainer, eventEmitter);

// Создание объекта Отображения хедера
const headerView = new HeaderView(headerContainer, eventEmitter);

// Создание объекта Модели корзины
const basketModel = new BasketModel(eventEmitter);

// Создание объекта Отображения списка Корзины
const basketListView = new BasketListView(basketContainerElement, eventEmitter);

// Создание объекта Модели Заказа товаров
const orderMakerModel = new OrderMakerModel(eventEmitter);
//const customer = new CustomerProcessingModel(eventEmitter);

// Создание объекта формы Заказа
const orderFormView = new OrderFormView(orderFormElement, eventEmitter);

// Подписка на добавление данных покупателя
//eventEmitter.on(CustomerModelEvents.CustomerDataChanged, function () {});
//

// Подписка на окончательное создание заказа
//eventEmitter.on(OrderModelEvents.OrderDataCreated, function () {});

export function checkBasket(id: string) {
	const item: ItemBasket[] = basketModel.itemsList;
	const itemExists = item.some((previousItem) => previousItem.id === id);
	return itemExists;
}

function displayBusket() {
	let itemNumber = 1;
	const basketList = basketModel.itemsList.map((item) => {
		const liElementClone = previewItemInList.cloneNode(true) as HTMLLIElement;
		const itemLiInstant = new CardBasketView(liElementClone, eventEmitter);
		itemLiInstant.setNumberInList(itemNumber);
		itemNumber += 1;
		return itemLiInstant.render(item);
	});

	const itemsInBusket: IBasketItem = {
		totalPrice: basketModel.getTotalPrice(),
		item: basketList as HTMLLIElement[],
	};

	return itemsInBusket;
}

// Главная подписка на первоначальную загрузку и сохранение данных
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
	if (modalCardView.isUsed) {
		itemsCatalogModel.clearSelectedItem();
		modalCardView.clearProperties();
	}
	//if (cardBasketView.isUsed())
	if (basketListView.isUsed()) {
		basketListView.clearProperties();
	}
	modalWrapperView.closemodalWrapperAndClear();
});

// Подписка на событие клика по кнопке Добавить в корзину
eventEmitter.on<ItemsId>(
	ModalCardViewEvents.CardPreviewButtonClicked,
	(payload) => {
		const { id } = payload;
		const result = checkBasket(id);
		if (result) {
			basketModel.removeItem(id);
		} else {
			basketModel.addItem(itemsCatalogModel.getItem(id));
			basketModel.getQuantity;
		}
	}
);

// Подписка на добавление товара в корзину
eventEmitter.on<ItemsId>(BasketModelEvents.ItemAdded, (payload) => {
	//const { id } = payload;
	modalCardView.buttonToDelete();
	headerView.basketCounter = basketModel.getQuantity();
});

// Подписка на удаление товара из корзины
eventEmitter.on<ItemsId>(BasketModelEvents.ItemDeleted, (payload) => {
	//const { id } = payload;
	if (modalCardView.isUsed) {
		modalCardView.buttonToBuy();
	}

	headerView.basketCounter = basketModel.getQuantity();
	if (basketListView.isUsed()) {
		basketListView.clearProperties();
		basketListView.render(displayBusket());
	}
});

// Подписка на клик по кнопке корзины
eventEmitter.on(HeaderEvents.BusketButtonClicked, function () {
	const itemsInBusket = displayBusket();
	const busketListUlContainer = basketListView.render(itemsInBusket);
	modalWrapperView.insertContentAndDisplay(busketListUlContainer);
});

// Подписка на нажатие кнопки удаления товара из Списка Корзины
eventEmitter.on<ItemsId>(
	CardBasketViewEvents.ButtonDeleteClecked,
	(payload) => {
		const { id } = payload;
		basketModel.removeItem(id);
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		orderMakerModel.removeItem(id);
	}
);
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Подписка на событие нажатия кнопки Оформить Список Товаров
eventEmitter.on(BasketListViewEvents.buttonToOrderClicked, () => {
	orderMakerModel.setItems(basketModel.getItemsId());
	basketListView.clearProperties();
	modalWrapperView.closemodalWrapperAndClear();
	modalWrapperView.insertContentAndDisplay(
		orderFormView.render({ spanErrors: '', buttonState: false })
	);
});

// Подписка на событие выбора формы оплаты
eventEmitter.on<Payment>(OrderFormEvents.PaymentChoosed, (payload) => {
	const { payment } = payload;
	if (payment === 'card') {
		orderFormView.render({ card: true, cash: false });
	} else {
		orderFormView.render({ cash: true, card: false });
	}
	orderMakerModel.setPayment(payment);
	console.log(orderMakerModel.order);
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
