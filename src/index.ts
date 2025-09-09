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

// Главный контейнер страницы
const page: HTMLElement = ensureElement('.page');
const headerContainer = ensureElement<HTMLElement>('.header__container', page);

// Темплейт для заполнения данными для галереи
const galleryTemplate: HTMLTemplateElement =
	page.querySelector('#card-catalog');
const containerButtonForItem: HTMLElement = cloneTemplate(galleryTemplate);

// Контейнер, где будет располагаться галерея
const containerToPasteGalary: HTMLElement = ensureElement('.gallery', page);

// Темплейт для заполнения обёртки модального окна
const previewTemplate: HTMLTemplateElement =
	page.querySelector('#card-preview');
// Контейнер для заполнения обёртки модального окна
const previewContainer: HTMLElement = cloneTemplate(previewTemplate);

// Обёртка для модального окна
const modalWrapper = ensureElement('.modal');

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

let itemsCatalog: IItemModel[] = [];

//? Независимые события (не требуют данных?)

// Создание объекта Отображения хедера
//const headerView = new HeaderView(headerContainer, eventEmitter);

// Подписка на клик по кнопке корзины
//eventEmitter.on(HeaderEvents.BusketButtonClicked, function () {});

// Создание объекта Модели корзины
const basketModel = new BasketModel(eventEmitter);

//const customer = new CustomerProcessingModel(eventEmitter);

// Подписка на добавление данных покупателя
//eventEmitter.on(CustomerModelEvents.CustomerDataChanged, function () {});
//const orderMakerModel = new OrderMakerModel(eventEmitter);

// Подписка на окончательное создание заказа
//eventEmitter.on(OrderModelEvents.OrderDataCreated, function () {});

export function checkBasket(id: string) {
	const item: ItemBasket[] = basketModel.itemsList;
	const itemExists = item.some((previousItem) => previousItem.id === id);
	console.log(basketModel.itemsList);
	return itemExists;
}

// Главная подписка на первоначальную загрузку и сохранение данных
eventEmitter.on(CatalogModelEvents.Initialized, function () {
	// Получаем массив обработанных и сохранённых данных из модели
	itemsCatalog = itemsCatalogModel.catalog;

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

	// Подписываемся на события, зависящие от данных

	// Подписка на клик по карточке в галерее
	eventEmitter.on<ClickedGallaryItem>(
		GalleryViewEvents.GalleryButtonClicked,
		(payload) => {
			const { item } = payload;
			console.log(item);

			itemsCatalogModel.setSelectedItem(item);
		}
	);

	// Подписка на событие сохранения выделенного кликнутого товара
	eventEmitter.on(CatalogModelEvents.ItemSelected, function () {
		const selectedItem = itemsCatalogModel.selectedItem;
		console.log(selectedItem);

		//----------
		const readyItem = modalCardView.render(selectedItem);
		console.log(readyItem);
		modalWrapperView.insertContentAndDisplay(readyItem);
	});

	// Подписка на событие клика по кнопке закрытия модалки
	eventEmitter.on(ModalWrapperEvents.CloseButtonClicked, function () {
		itemsCatalogModel.clearSelectedItem();
		modalCardView.clearProperties();
		modalWrapperView.closemodalWrapperAndClear();

		console.log(itemsCatalogModel.selectedItem);
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
			}
		}
	);

	// Подписка на добавление товара в корзину
	eventEmitter.on<ItemsId>(BasketModelEvents.ItemAdded, (payload) => {
		//const { id } = payload;

		modalCardView.buttonDelete();
	});

	// Подписка на удаление товара из корзины
	eventEmitter.on<ItemsId>(BasketModelEvents.ItemDeleted, (payload) => {
		//const { id } = payload;
		modalCardView.buttonBuy();
	});
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
